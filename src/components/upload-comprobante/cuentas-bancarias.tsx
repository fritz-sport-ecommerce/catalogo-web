import React, { useState } from 'react'

export default function CuentasBancarias({cuentasBancarias}:any) {
  const [copied, setCopied] = useState(false);
  const [cuenta, setCuenta] = useState("")
    // Cuentas bancarias
    const bankAccounts = cuentasBancarias;
    
  const handleCopy = (account: string) => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setCuenta(account)
    setTimeout(() => setCopied(false), 2000);
  };
  return (

         <div>
             <h2 className="text-md font-semibold text-gray-600 mt-5 text-center bg-white py-2 rounded-lg">Cuentas Bancarias</h2>
      <ul className="mt-4 space-y-4">
        {bankAccounts.map(({ bank, account ,cci}:any) => (
          <li key={account} className=" bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-medium text-gray-700 px-2">{bank}</p>
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <div>
                  <div className='flex flex-col gap-y-2'> 
                  <p className="text-md text-gray-600 font-medium">{account}</p>
                  <p className="text-md text-gray-600 font-medium">{cci}</p>

                  </div>

                </div>
                <div className='flex flex-col gap-y-2'>
                <button
                  onClick={() => handleCopy(account)}
                  className={`px-4 py-1 w-32  text-white text-sm rounded-md  ${copied && cuenta === account ? "bg-green-700" : "bg-blue-gray-900"} `}

                >
                  {copied && cuenta === account ? "Copiado" : "Copiar"}
                </button>
                <button
                  onClick={() => handleCopy(cci)}
                  className={`px-4 py-1 w-32  text-white text-sm rounded-md  ${copied && cuenta === cci ? "bg-green-700" : "bg-blue-gray-900"} `}
                >
                  {copied&& cuenta === cci ? "Copiado" : "Copiar"}
                </button>

                </div>

              </div>
          </li>
        ))}
      </ul>
      </div>
 
  )
}
