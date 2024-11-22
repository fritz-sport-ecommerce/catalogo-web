import React, { useState } from 'react';

interface SizeData {
  headers: string[];
  rows: { label: string; values: string[] }[];
}

interface SizeSectionProps {
  title: string;
  ageRange: string;
  sizeData: SizeData;
  isInches: boolean;
  toggleUnits: () => void;
}

const SizeTable: React.FC<{ isInches: boolean; sizeData: SizeData }> = ({ isInches, sizeData }) => {
  const { headers, rows } = sizeData;

  return (
    <div className=" text-xs xl:text-sm w-full ">
      <table className="min-w-full bg-white dark:bg-gray-800 border ">
        <caption className="sr-only">{isInches ? 'Pulgadas' : 'cm'}</caption>
        <thead>
          <tr>
            <th className="border  dark:border-white">Punta-talón</th>
            {headers.map((header, index) => (
              <th key={index} className="border border-white">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody >
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className=' border dark:border-white'>
                <th className="border dark:border-white">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={index} className="border xl:p-2 p-2 text-center dark:border-white">{value}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const SizeSection: React.FC<SizeSectionProps> = ({ title, ageRange, sizeData, isInches, toggleUnits }) => (
  <section className="mb-1  text-xs xl:text-lg w-full">
    <div className={`p-2 rounded-md  flex justify-center flex-col overflow-x-auto w-full bg-white dark:bg-gray-800`}>
      <h2 className="text-lg font-normal">{title}</h2>
      <p>{ageRange}</p>
      <div className="flex flex-col  md:flex-row mb-4 text-sm w-full">
        <button 
          className={`flex-1 py-1 text-center w-full ${isInches ? 'bg-black text-white' : 'bg-gray-300 dark:bg-gray-600'}`} 
          onClick={toggleUnits}
        >
          Pulgadas
        </button>
        <button 
          className={`flex-1 py-1 text-center w-full ${!isInches ? 'bg-black text-white' : 'bg-gray-300 dark:bg-gray-600'}`} 
          onClick={toggleUnits}
        >
          cm
        </button>
      </div>
      <SizeTable isInches={isInches} sizeData={sizeData} />
    </div>
  </section>
);

const SizeComponent: React.FC = () => {
  const [isInches, setIsInches] = useState<boolean>(true);

  const toggleUnits = () => setIsInches(prev => !prev);

  const sizeDataList = [
    {
      title: "BEBÉS Y NIÑOS/AS PEQUEÑOS",
      ageRange: "Niños y niñas de 0 a 3 años.",
      sizeData: {
        headers: isInches
          ? ["3.2\"", "3.5\"", "3.9\"", "4.2\"", "4.5\"", "4.8\"", "5.0\"", "5.2\"", "5.4\"", "5.5\"", "5.7\"", "5.9\"", "6.0\"", "6.2\"", "6.3\""]
          : ["8.1 cm", "9 cm", "9.8 cm", "10.6 cm", "11.5 cm", "12.3 cm", "12.8 cm", "13.2 cm", "13.6 cm", "14 cm", "14.5 cm", "14.9 cm", "15.3 cm", "15.7 cm", "16.1 cm"],
        rows: [
          { label: "UK", values: ["0k", "1k", "2k", "3k", "4k", "5k", "5.5k", "6k", "6.5k", "7k", "7.5k", "8k", "8.5k", "9k", "9.5k"] },
          { label: "US", values: ["1k", "2k", "3k", "4k", "5k", "5.5k", "6k", "6.5k", "7k", "7.5k", "8k", "8.5k", "9k", "9.5k", "10k"] },
          { label: "EU", values: ["16", "17", "18", "19", "20", "21", "22", "23", "23.5", "24", "25", "25.5", "26", "26.5", "27"] },
        ],
      },
    },
    {
      title: "NIÑOS/AS",
      ageRange: "Niños y niñas de 4 a 7 años.",
      sizeData: {
        headers: isInches
          ? ["6.5\"", "6.7\"", "6.9\"", "7.0\"", "7.2\"", "7.4\"", "7.5\"", "7.7\"", "7.9\"", "8.0\"", "8.2\"", "8.3\""]
          : ["16.6 cm", "17 cm", "17.4 cm", "17.8 cm", "18.3 cm", "18.7 cm", "19.1 cm", "19.5 cm", "20 cm", "20.4 cm", "20.8 cm", "21.2 cm"],
        rows: [
          { label: "UK", values: ["10k", "10.5k", "11 km", "11.5k", "12k", "12.5k", "13k", "13.5k", "1", "1.5", "2", "2.5"] },
          { label: "US", values: ["10.5k", "11 km", "11.5k", "12k", "12.5k", "13k", "13.5k", "1", "1.5", "2", "2.5", "3"] },
          { label: "EU", values: ["28", "28.5", "29", "30", "30.5", "31", "31.5", "32", "33", "33.5", "34", "35"] },
        ],
      },
    },
    {
      title: "JÓVENES Y ADOLESCENTES",
      ageRange: "Niños y niñas de 8 a 16 años.",
      sizeData: {
        headers: isInches
          ? ["8.5\"", "8.7\"", "8.9\"", "9.0\"", "9.2\"", "9.4\"", "9.5\"", "9.7\"", "9.8\""]
          : ["21.6 cm", "22.1 cm", "22.5 cm", "22.9 cm", "23.3 cm", "23.8 cm", "24.2 cm", "24.6 cm", "25 cm"],
        rows: [
          { label: "UK", values: ["3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7"] },
          { label: "US", values: ["3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5"] },
          { label: "EU", values: ["35.5", "36", "36 2/3", "37 1/2", "38", "38 2/3", "39 1/3", "40", "40 2/3"] },
        ],
      },
    },
  ];

  return (
    <div className=''>

      {sizeDataList.map((sizeData, index) => (
        <SizeSection 
          key={index}
          title={sizeData.title}
          ageRange={sizeData.ageRange}
          sizeData={sizeData.sizeData}
          isInches={isInches}
          toggleUnits={toggleUnits}
        />
      ))}
    </div>
  );
};

export default SizeComponent;
