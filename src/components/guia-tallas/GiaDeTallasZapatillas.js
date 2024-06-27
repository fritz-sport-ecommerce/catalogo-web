"use client";

export default function GiaDeTallasZapatillas({ dataTallasZapatillas }) {
  return (
    <div className=" 2xl:p-3 py-3 px-5 xl:w-full ">
      {/* <div className="xl:text-xl lg:text-lg  font-extrabold text-center text-white uppercase mb-5">
        {dataTallasZapatillas?.title}
      </div> */}
      <table className="w-full  table-auto text-left text-white ">
        <thead>
          <tr className="sticky top-0 mb-10 ">
            {dataTallasZapatillas?.TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-black 2xl:p-2 p-1 "
              >
                <div className=" font-extrabold text-white uppercase 2xl:text-base text-sm leading-none opacity-70 text-center">
                  {head}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataTallasZapatillas?.TABLE_ROWS.map(
            ({ TITLE, ADIDAS, REEBOK, NIKE, CAT, FILA }, index) => (
              <tr key={index} className="">
                <td className="">
                  <div
                    variant="small"
                    color="blue-gray"
                    className="font-normal hover:bg-blue-gray-800 border-[1px]  2xl:px-1 2xl:py-1 flex justify-center 2xl:text-xs text-sm h-full text-center"
                  >
                    {TITLE}
                  </div>
                </td>
                <td className="">
                  <div
                    variant="small"
                    color="blue-gray"
                    className="font-normal hover:bg-blue-gray-800 border-[1px]  2xl:px-1 2xl:py-1 flex justify-center 2xl:text-xs text-sm h-full text-center"
                  >
                    {ADIDAS}
                  </div>
                </td>
                <td className="">
                  <div
                    variant="small"
                    color="blue-gray"
                    className="font-normal hover:bg-blue-gray-800 border-[1px]  2xl:px-1 2xl:py-1 flex justify-center 2xl:text-xs text-sm h-full text-center"
                  >
                    {REEBOK}
                  </div>
                </td>
                <td className="">
                  <div
                    variant="small"
                    color="blue-gray"
                    className="font-normal hover:bg-blue-gray-800 border-[1px]  2xl:px-1 2xl:py-1 flex justify-center 2xl:text-xs text-sm h-full text-center"
                  >
                    {NIKE}
                  </div>
                </td>
                <td className="">
                  <div
                    variant="small"
                    color="blue-gray"
                    className="font-normal hover:bg-blue-gray-800 border-[1px]  2xl:px-1 2xl:py-1 flex justify-center 2xl:text-xs text-sm h-full text-center"
                  >
                    {CAT}
                  </div>
                </td>
                {FILA && (
                  <td className="">
                    <div
                      variant="small"
                      color="blue-gray"
                      className="font-normal hover:bg-blue-gray-800 border-[1px]  2xl:px-1 2xl:py-1 flex justify-center 2xl:text-xs text-sm h-full text-center"
                    >
                      {FILA}
                    </div>
                  </td>
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
