import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import img from "/public/vercel.svg";
import {
  fetchManuals,
  Manual,
  searchManuals,
  searchManualsMultipleColumns,
} from "../lib/supabase";
import React, { useState } from "react";
import { useRouter } from "next/router";

type PageProps = {
  manuals: Manual[];
};

type SearchParameter = {
  keyword: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { keyword } = context.query;

  if (keyword) {
    keyword = `${keyword}`;
  }

  const manulas = await searchManuals(keyword);
  // 全件取得
  // const manulas = await fetchManuals(keyword)
  // 複数列を対象に全文検索
  // const manulas = await searchManualsMultipleColumns(keyword)

  return {
    props: {
      manuals: manulas,
    },
  };
};

export default function Home(props: PageProps) {
  const [keyword, setKeyworkd] = useState<string>("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = {} as SearchParameter;

    if (keyword) {
      query.keyword = keyword;
    }

    router.push({
      pathname: "/",
      query: query,
    });
  };

  return (
    <div className="">
      <div className="container mx-auto min-h-screen">
        <div className="shadow-sm sm:rounded-lg mt-3">
          <div className="relative mb-5">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 ">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                className="block p-2 border pl-10 w-full text-sm text-gray-900 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Search"
                value={keyword}
                onChange={(e) => setKeyworkd(e.target.value)}
              />
            </form>
          </div>
          <table className="w-full table-fixed text-sl text-gray-600">
            <thead className="text-left text-gray-700 bg-gray-100">
              <tr>
                <th className="w-1/5 px-4 py-2">画像</th>
                <th className="w-2/5 px-4 py-2">タイトル</th>
                <th className="w-2/5 px-4 py-2">概要</th>
              </tr>
            </thead>
            <tbody>
              {props.manuals?.map((manual) => {
                return (
                  <tr key={manual.id} className="bg-white border-b">
                    <td className="px-4 py-2">
                      <Image src={img} width={100} height={100} alt="Image" />
                    </td>
                    <td className="px-4 py-2">{manual.title}</td>
                    <td className="px-4 py-2">{manual.summary}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
