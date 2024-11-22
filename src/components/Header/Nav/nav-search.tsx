
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Input } from "@/components/ui/input"

export default function NavSearch() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultSearch = searchParams.get("search") ?? ""
  if (pathname.startsWith("/studio")) return null

  function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const searchQuery = formData.get("search")
    router.replace(`/tienda?search=${searchQuery}`)
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()

    const searchQuery = event.target.value
    router.replace(`/tienda?search=${searchQuery}`)
  }
  return (
    <div className="w-4/6 xl:w-auto">
      <form onSubmit={onSubmit} className="items-center lg:inline-flex ">
        <div className="flex">
          <Input
            onChange={onChange}
            id="search"
            name="search"
            type="search"
            autoComplete="off"
            placeholder="Buscar..."
            className="h-9 rounded-none bg-white py-5  text-black outline-none focus:border-current  focus:ring-0 dark:bg-black dark:text-white lg:w-[300px]"
            defaultValue={defaultSearch}
          />
          {/* icon search */}
          <div className="flex  items-center justify-center bg-black fill-white stroke-white px-3 dark:bg-white dark:stroke-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        </div>
      </form>
    </div>
  )
}
