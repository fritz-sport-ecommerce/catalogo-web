import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Logo } from "../logo/logo";
import LibroReclamacionesRedes from "../Footer/libro-reclamaciones-redes";

const date = new Date();
const FooterMobil = () => {
  return (
    <div className="block xl:hidden">
      <div className="flex w-full justify-center items-center">
        <Logo />
      </div>

      <Accordion type="single" collapsible className="my-10 ">
        {/* tiendas */}
        <AccordionItem value={`item-}`}>
          <AccordionTrigger className="border-[1px]  border-t-black">
            <span className="w-full  ">
              <span className="ml-1 text-sm xl:text-base   uppercase text-black dark:text-gray-400">
                Tiendas
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className=" flex  gap-y-5  justify-center">
              <div className="flex flex-col items-start gap-y-5">
                <Link
                  href={"https://maps.app.goo.gl/h54ryBi9SqHQkQUW6"}
                  target="_blank"
                >
                  <div className={`flex flex-col  items-start justify-start `}>
                    Tienda - Miguel Grau
                    <span className="text-xs text-blue-gray-300 mt-1">
                      Cercado de Lima
                    </span>
                  </div>
                </Link>
                <Link
                  href={"https://maps.app.goo.gl/iUxXwFKqF2BAEGhC7"}
                  target="_blank"
                >
                  <div className={`flex flex-col  items-start justify-start  `}>
                    Tienda - Tumbes
                    <span className="text-xs text-blue-gray-300 mt-1">
                      Av. República del Perú 373, 24101
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* cuenta */}
        <AccordionItem value={`item-}`}>
          <AccordionTrigger className="border-[1px]  border-t-black">
            <span className="w-full  ">
              <span className="ml-1 text-sm xl:text-base   uppercase text-black dark:text-gray-400">
                Cuenta
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className=" flex  gap-y-5  justify-center">
              <div className="flex flex-col items-start gap-y-5">
                <Link href={"/auth"}>
                  <div className={`flex flex-col  items-start justify-start `}>
                    Mi Cuenta
                  </div>
                </Link>
                <Link href={"/auth"}>
                  <div className={`flex flex-col  items-start justify-start  `}>
                    Regístrate
                  </div>
                </Link>
                <Link
                  href={
                    "https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0"
                  }
                  target="_blank"
                >
                  <div className={`flex flex-col  items-start justify-start  `}>
                    Soporte
                  </div>
                </Link>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* información */}
        <AccordionItem value={`item-}`}>
          <AccordionTrigger className="border-[1px]  border-t-black">
            <span className="w-full  ">
              <span className="ml-1 text-sm xl:text-base   uppercase text-black dark:text-gray-400">
                Información
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className=" flex  gap-y-5  justify-center">
              <div className="flex flex-col items-start gap-y-5">
                <Link href={"/pyp"}>
                  <div className={`flex flex-col  items-start justify-start `}>
                    Políticas
                  </div>
                </Link>
                <Link href={"/tyc"}>
                  <div className={`flex flex-col  items-start justify-start  `}>
                    Términos y condiciones
                  </div>
                </Link>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Redes Sociales */}
        <AccordionItem value={`item-}`}>
          <AccordionTrigger className="border-[1px]  border-t-black">
            <span className="w-full  ">
              <span className="ml-1 text-sm xl:text-base   uppercase text-black dark:text-gray-400">
                Redes Sociales
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className=" flex  gap-y-5  justify-center">
              <div className="flex flex-col items-start gap-y-5">
                <Link
                  href={"https://www.instagram.com/fritzsport/"}
                  target="_blank"
                >
                  <div className={`flex flex-col  items-start justify-start `}>
                    Instagram
                  </div>
                </Link>
                <Link
                  href={"https://www.facebook.com/fritzsportsac/"}
                  target="_blank"
                >
                  <div className={`flex flex-col  items-start justify-start  `}>
                    Facebook
                  </div>
                </Link>
                <Link
                  href={"https://www.tiktok.com/@fritzsport"}
                  target="_blank"
                >
                  <div className={`flex flex-col  items-start justify-start  `}>
                    Tik Tok
                  </div>
                </Link>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Únete a Nosotros */}
        <AccordionItem value={`item-}`}>
          <AccordionTrigger className="border-[1px]  border-t-black">
            <span className="w-full  ">
              <span className="ml-1 text-sm xl:text-base   uppercase text-black dark:text-gray-400">
                Trabaja con Nosotros
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className=" flex  gap-y-5  justify-center">
              <div className="flex flex-col items-start gap-y-5">
                <Link
                  href={
                    "https://api.whatsapp.com/send/?phone=51908843497&text=%EF%BF%BD20%25Quisiera+trabajar+en+Fritz+Sport&type=phone_number&app_absent=0"
                  }
                  target="_blank"
                >
                  <div className={`flex flex-col  items-start justify-start `}>
                    Trabaja con Nosotros
                  </div>
                </Link>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* medios de pago */}
      <div className="flex justify-center w-full">
        <div className="flex justify-around w-3/5 items-center ">
          <svg
            className="stroke-black dark:stroke-white"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40.977 30.6457C40.0727 30.1903 39.3185 29.4844 38.8044 28.612C35.9206 29.1857 32.9953 29.5258 30.0568 29.6289C26.3558 29.6289 23.3699 29.4532 24.5895 26.0046C25.8091 22.556 29.0474 15.4485 30.1829 14.0186C31.3184 12.5887 32.8688 10.7796 33.6315 10.8644C34.5778 10.9695 36.3467 12.1478 36.1481 12.8977C35.9589 13.6127 35.0194 15.1751 33.401 14.0626"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32.8633 14.8391C33.2219 14.2389 33.6563 13.6875 34.1559 13.1985"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M35.9394 13.4064C36.5071 13.2621 37.5794 13.9882 36.9744 14.7336C36.2094 15.4774 35.2175 15.9438 34.1566 16.0584C33.5318 16.114 31.3599 16.0374 31.3599 16.0374C30.4347 17.6355 30.645 20.0748 30.5608 22.2196C30.5176 23.4865 30.2172 24.7314 29.6777 25.8785C33.3786 24.1542 39.687 22.8505 43.5001 23.4813"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.02344 30.6457C7.92777 30.1903 8.68197 29.4844 9.19604 28.612C12.0798 29.1857 15.0052 29.5258 17.9436 29.6289C21.6446 29.6289 24.6305 29.4532 23.4109 26.0046C22.1913 22.556 18.953 15.4485 17.8175 14.0186C16.682 12.5887 15.1316 10.7796 14.3689 10.8644C13.4226 10.9695 11.6537 12.1478 11.8523 12.8977C12.0415 13.6127 12.981 15.1751 14.5994 14.0626"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.1363 14.8391C14.7778 14.2389 14.3433 13.6875 13.8438 13.1985"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.0607 13.4064C11.493 13.2621 10.4202 13.9882 11.0257 14.7336C11.7907 15.4774 12.7827 15.9438 13.8435 16.0584C14.4683 16.114 16.6402 16.0374 16.6402 16.0374C17.5654 17.6355 17.3551 20.0748 17.4393 22.2196C17.4825 23.4865 17.7829 24.7314 18.3224 25.8785C14.6215 24.1542 8.3131 22.8505 4.5 23.4813"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32.1805 11.742C26.8515 10.0858 21.1453 10.086 15.8164 11.7426"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.9168 13.9893C6.9758 16.4599 4.5 20.0299 4.5 23.9999C4.5 31.4557 13.23 37.4999 24 37.4999C34.77 37.4999 43.5 31.4557 43.5 23.9999C43.5 20.0294 41.0241 16.4592 37.0828 13.989"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <svg
            className="dark:fill-white fill-black"
            width="65"
            height="21"
            viewBox="0 0 65 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M32.1836 0.377325L27.8426 20.6899H22.5892L26.9367 0.377325H32.1836ZM54.283 13.4926L57.0462 5.86369L58.6391 13.4926H54.283ZM60.141 20.6899H65L60.7609 0.377325H56.2768C56.2703 0.377325 56.2617 0.377325 56.2552 0.377325C55.2604 0.377325 54.4065 0.986679 54.0467 1.85192L54.0402 1.8671L46.1623 20.6899H51.6758L52.7724 17.654H59.5104L60.141 20.6899ZM46.4332 14.0586C46.4549 8.69579 39.0234 8.40087 39.0754 6.00465C39.0928 5.27602 39.7841 4.49969 41.3012 4.30235C41.5829 4.27416 41.908 4.25682 42.2374 4.25682C43.7783 4.25682 45.2391 4.60812 46.5394 5.23699L46.4809 5.21097L47.402 0.902107C45.9434 0.336122 44.2551 0.00650558 42.491 0H42.4888C37.2961 0 33.6443 2.76487 33.6118 6.71809C33.5793 9.64126 36.219 11.2698 38.2107 12.2457C40.2587 13.241 40.9458 13.8807 40.9349 14.7677C40.9219 16.1338 39.3051 16.7323 37.7924 16.7562C37.7231 16.7584 37.6385 16.7584 37.5562 16.7584C35.6685 16.7584 33.8914 16.2835 32.3396 15.4442L32.3981 15.4724L31.4467 19.9222C33.1502 20.6053 35.1245 21 37.1921 21C37.2246 21 37.2571 21 37.2896 21H37.2853C42.8031 21 46.4115 18.2742 46.431 14.052L46.4332 14.0586ZM24.6784 0.377325L16.1698 20.6899H10.6173L6.43021 4.47584C6.35003 3.68649 5.86673 3.02726 5.19489 2.69765L5.18188 2.69114C3.69082 1.95818 1.95702 1.36183 0.143038 0.986679L0 0.962826L0.1257 0.375156H9.06342C10.2814 0.375156 11.2935 1.26642 11.4821 2.43092L11.4842 2.44393L13.697 14.1995L19.1628 0.372986L24.6784 0.377325Z" />
          </svg>
          <svg
            className="dark:fill-white fill-black"
            width="32"
            height="21"
            viewBox="0 0 32 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.7311 8.28701e-07C18.9421 -0.000712312 17.1829 0.458856 15.6228 1.33452C14.0248 0.441317 12.221 -0.0185321 10.3903 0.000589509C8.55968 0.0197112 6.76586 0.51714 5.1868 1.44353C3.60775 2.36991 2.29835 3.69306 1.38851 5.2817C0.478665 6.87035 0 8.66927 0 10.5C0 12.3307 0.478665 14.1297 1.38851 15.7183C2.29835 17.307 3.60775 18.6301 5.1868 19.5565C6.76586 20.4829 8.55968 20.9803 10.3903 20.9994C12.221 21.0185 14.0248 20.5587 15.6228 19.6655C17.0235 20.4462 18.5843 20.8957 20.1856 20.9794C21.787 21.0631 23.3862 20.7789 24.8606 20.1484C26.3349 19.518 27.6453 18.5581 28.691 17.3426C29.7368 16.127 30.4901 14.688 30.8933 13.136C31.2964 11.5839 31.3387 9.96021 31.0167 8.38936C30.6947 6.8185 30.0172 5.34228 29.036 4.074C28.0548 2.80571 26.7961 1.77908 25.3565 1.07288C23.9169 0.366679 22.3346 -0.000386908 20.7311 8.28701e-07ZM12.8844 17.4532C12.1235 17.7255 11.3226 17.8692 10.5146 17.8785C8.5577 17.8785 6.68095 17.1012 5.29721 15.7174C3.91347 14.3337 3.1361 12.4569 3.1361 10.5C3.1361 8.54314 3.91347 6.66639 5.29721 5.28265C6.68095 3.89892 8.5577 3.12154 10.5146 3.12154C11.3227 3.13088 12.1235 3.27463 12.8844 3.54689C11.1756 5.45984 10.2311 7.93503 10.2311 10.5C10.2311 13.065 11.1756 15.5403 12.8844 17.4532ZM15.6228 15.8029C14.9054 15.1185 14.3342 14.2957 13.944 13.3842C13.5538 12.4727 13.3526 11.4915 13.3526 10.5C13.3526 9.50849 13.5538 8.52729 13.944 7.6158C14.3342 6.70431 14.9054 5.88148 15.6228 5.19713C16.3403 5.88148 16.9114 6.70431 17.3017 7.6158C17.6919 8.52729 17.8931 9.50849 17.8931 10.5C17.8931 11.4915 17.6919 12.4727 17.3017 13.3842C16.9114 14.2957 16.3403 15.1185 15.6228 15.8029ZM20.7311 17.8785C19.923 17.8691 19.1222 17.7254 18.3613 17.4532C20.0701 15.5402 21.0146 13.065 21.0146 10.5C21.0146 7.93503 20.0701 5.45984 18.3613 3.54689C19.1222 3.27463 19.923 3.13088 20.7311 3.12154C22.688 3.12154 24.5647 3.89892 25.9485 5.28265C27.3322 6.66639 28.1096 8.54314 28.1096 10.5C28.1096 12.4569 27.3322 14.3337 25.9485 15.7174C24.5647 17.1012 22.688 17.8785 20.7311 17.8785Z" />
          </svg>
        </div>
      </div>

      <LibroReclamacionesRedes />
      <div className="flex justify-center w-full ">
        <div className="flex justify-center text-xs flex-col items-center">
          <span>
            Todos los derechos Reservados Fritz Sport {date.getFullYear()}
          </span>

          <small className="mt-1">
            Images are the property of Adidas and Nike ecommerce
          </small>
        </div>
      </div>
    </div>
  );
};

export default function Footer() {
  return (
    <div>
      <div>
        <div>
          <FooterMobil></FooterMobil>
          <div className="xl:block hidden ">
            <div className="flex justify-center">
              <div>
                <div className="py-5 border-b-[1px] border-black dark:border-white"></div>
                <div className="flex w-full justify-center items-center">
                  <Logo />
                </div>
                <div className="flex w-full justify-center py-5">
                  <div className=" grid grid-cols-6 gap-x-10 py-5">
                    {/* tiendas */}
                    <ul className="flex flex-col gap-y-3 border-l-[1px] dark:border-white border-black px-4">
                      <div className="uppercase text-sm">Tiendas</div>
                      <Link
                        href={"https://maps.app.goo.gl/h54ryBi9SqHQkQUW6"}
                        target="_blank"
                      >
                        <div
                          className={`flex flex-col text-sm items-start justify-start `}
                        >
                          Tienda - Miguel Grau
                          <span className="text-xs text-blue-gray-300 mt-1">
                            Cercado de Lima
                          </span>
                        </div>
                      </Link>
                      <Link
                        href={"https://maps.app.goo.gl/iUxXwFKqF2BAEGhC7"}
                        target="_blank"
                      >
                        <div
                          className={`flex flex-col  text-sm items-start justify-start  `}
                        >
                          Tienda - Tumbes
                          <span className="text-xs text-blue-gray-300 mt-1">
                            Av. República del Perú 373, 24101
                          </span>
                        </div>
                      </Link>
                    </ul>
                    {/* cuenta */}
                    <ul className="flex flex-col gap-y-3 border-l-[1px] dark:border-white border-black px-4 text-sm">
                      <div className="uppercase">Cuenta</div>
                      <Link href={"/auth"}>
                        <div
                          className={`flex flex-col  items-start justify-start `}
                        >
                          Mi Cuenta
                        </div>
                      </Link>
                      <Link href={"/auth"}>
                        <div
                          className={`flex flex-col  items-start justify-start  `}
                        >
                          Regístrate
                        </div>
                      </Link>
                      <Link
                        href={
                          "https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0"
                        }
                        target="_blank"
                      >
                        <div
                          className={`flex flex-col  items-start justify-start  `}
                        >
                          Soporte
                        </div>
                      </Link>
                    </ul>
                    {/* Información */}
                    <ul className="flex flex-col gap-y-3 border-l-[1px] dark:border-white border-black px-4 text-sm">
                      <div className="uppercase">Información</div>
                      <Link href={"/pyp"}>
                        <div
                          className={`flex flex-col  items-start justify-start `}
                        >
                          Políticas
                        </div>
                      </Link>
                      <Link href={"/tyc"}>
                        <div
                          className={`flex flex-col  items-start justify-start  `}
                        >
                          Términos y condiciones
                        </div>
                      </Link>
                    </ul>
                    {/* redes sociales */}
                    <ul className="flex flex-col gap-y-3 border-l-[1px] dark:border-white border-black px-4 text-sm">
                      <div className="uppercase">Redes sociales</div>
                      <Link
                        href={"https://www.instagram.com/fritzsport/"}
                        target="_blank"
                      >
                        <div
                          className={`flex flex-col  items-start justify-start `}
                        >
                          Instagram
                        </div>
                      </Link>
                      <Link
                        href={"https://www.facebook.com/fritzsportsac/"}
                        target="_blank"
                      >
                        <div
                          className={`flex flex-col  items-start justify-start  `}
                        >
                          Facebook
                        </div>
                      </Link>
                      <Link
                        href={"https://www.tiktok.com/@fritzsport"}
                        target="_blank"
                      >
                        <div
                          className={`flex flex-col  items-start justify-start  `}
                        >
                          Tik Tok
                        </div>
                      </Link>
                    </ul>
                    {/* Trabaja con nosotros */}
                    <ul className="flex flex-col gap-y-3 border-l-[1px] dark:border-white border-black px-4 text-sm">
                      <div className="uppercase">Únete a nosotros</div>

                      <Link
                        href={
                          "https://api.whatsapp.com/send/?phone=51908843497&text=%EF%BF%BD20%25Quisiera+trabajar+en+Fritz+Sport&type=phone_number&app_absent=0"
                        }
                        target="_blank"
                      >
                        <div
                          className={`flex flex-col  items-start justify-start `}
                        >
                          Trabaja con Nosotros
                        </div>
                      </Link>
                    </ul>
                    {/* medios de pago */}
                    <div className="flex justify-center w-full border-l-[1px] dark:border-white border-black">
                      <div className="grid grid-cols-2 justify-items-center items-center h-20 gap-5 ">
                        <svg
                          className="stroke-black dark:stroke-white"
                          width="48"
                          height="48"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M40.977 30.6457C40.0727 30.1903 39.3185 29.4844 38.8044 28.612C35.9206 29.1857 32.9953 29.5258 30.0568 29.6289C26.3558 29.6289 23.3699 29.4532 24.5895 26.0046C25.8091 22.556 29.0474 15.4485 30.1829 14.0186C31.3184 12.5887 32.8688 10.7796 33.6315 10.8644C34.5778 10.9695 36.3467 12.1478 36.1481 12.8977C35.9589 13.6127 35.0194 15.1751 33.401 14.0626"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M32.8633 14.8391C33.2219 14.2389 33.6563 13.6875 34.1559 13.1985"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M35.9394 13.4064C36.5071 13.2621 37.5794 13.9882 36.9744 14.7336C36.2094 15.4774 35.2175 15.9438 34.1566 16.0584C33.5318 16.114 31.3599 16.0374 31.3599 16.0374C30.4347 17.6355 30.645 20.0748 30.5608 22.2196C30.5176 23.4865 30.2172 24.7314 29.6777 25.8785C33.3786 24.1542 39.687 22.8505 43.5001 23.4813"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.02344 30.6457C7.92777 30.1903 8.68197 29.4844 9.19604 28.612C12.0798 29.1857 15.0052 29.5258 17.9436 29.6289C21.6446 29.6289 24.6305 29.4532 23.4109 26.0046C22.1913 22.556 18.953 15.4485 17.8175 14.0186C16.682 12.5887 15.1316 10.7796 14.3689 10.8644C13.4226 10.9695 11.6537 12.1478 11.8523 12.8977C12.0415 13.6127 12.981 15.1751 14.5994 14.0626"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.1363 14.8391C14.7778 14.2389 14.3433 13.6875 13.8438 13.1985"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12.0607 13.4064C11.493 13.2621 10.4202 13.9882 11.0257 14.7336C11.7907 15.4774 12.7827 15.9438 13.8435 16.0584C14.4683 16.114 16.6402 16.0374 16.6402 16.0374C17.5654 17.6355 17.3551 20.0748 17.4393 22.2196C17.4825 23.4865 17.7829 24.7314 18.3224 25.8785C14.6215 24.1542 8.3131 22.8505 4.5 23.4813"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M32.1805 11.742C26.8515 10.0858 21.1453 10.086 15.8164 11.7426"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.9168 13.9893C6.9758 16.4599 4.5 20.0299 4.5 23.9999C4.5 31.4557 13.23 37.4999 24 37.4999C34.77 37.4999 43.5 31.4557 43.5 23.9999C43.5 20.0294 41.0241 16.4592 37.0828 13.989"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <svg
                          className="dark:fill-white fill-black"
                          width="65"
                          height="21"
                          viewBox="0 0 65 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M32.1836 0.377325L27.8426 20.6899H22.5892L26.9367 0.377325H32.1836ZM54.283 13.4926L57.0462 5.86369L58.6391 13.4926H54.283ZM60.141 20.6899H65L60.7609 0.377325H56.2768C56.2703 0.377325 56.2617 0.377325 56.2552 0.377325C55.2604 0.377325 54.4065 0.986679 54.0467 1.85192L54.0402 1.8671L46.1623 20.6899H51.6758L52.7724 17.654H59.5104L60.141 20.6899ZM46.4332 14.0586C46.4549 8.69579 39.0234 8.40087 39.0754 6.00465C39.0928 5.27602 39.7841 4.49969 41.3012 4.30235C41.5829 4.27416 41.908 4.25682 42.2374 4.25682C43.7783 4.25682 45.2391 4.60812 46.5394 5.23699L46.4809 5.21097L47.402 0.902107C45.9434 0.336122 44.2551 0.00650558 42.491 0H42.4888C37.2961 0 33.6443 2.76487 33.6118 6.71809C33.5793 9.64126 36.219 11.2698 38.2107 12.2457C40.2587 13.241 40.9458 13.8807 40.9349 14.7677C40.9219 16.1338 39.3051 16.7323 37.7924 16.7562C37.7231 16.7584 37.6385 16.7584 37.5562 16.7584C35.6685 16.7584 33.8914 16.2835 32.3396 15.4442L32.3981 15.4724L31.4467 19.9222C33.1502 20.6053 35.1245 21 37.1921 21C37.2246 21 37.2571 21 37.2896 21H37.2853C42.8031 21 46.4115 18.2742 46.431 14.052L46.4332 14.0586ZM24.6784 0.377325L16.1698 20.6899H10.6173L6.43021 4.47584C6.35003 3.68649 5.86673 3.02726 5.19489 2.69765L5.18188 2.69114C3.69082 1.95818 1.95702 1.36183 0.143038 0.986679L0 0.962826L0.1257 0.375156H9.06342C10.2814 0.375156 11.2935 1.26642 11.4821 2.43092L11.4842 2.44393L13.697 14.1995L19.1628 0.372986L24.6784 0.377325Z" />
                        </svg>
                        <svg
                          className="dark:fill-white fill-black"
                          width="32"
                          height="21"
                          viewBox="0 0 32 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M20.7311 8.28701e-07C18.9421 -0.000712312 17.1829 0.458856 15.6228 1.33452C14.0248 0.441317 12.221 -0.0185321 10.3903 0.000589509C8.55968 0.0197112 6.76586 0.51714 5.1868 1.44353C3.60775 2.36991 2.29835 3.69306 1.38851 5.2817C0.478665 6.87035 0 8.66927 0 10.5C0 12.3307 0.478665 14.1297 1.38851 15.7183C2.29835 17.307 3.60775 18.6301 5.1868 19.5565C6.76586 20.4829 8.55968 20.9803 10.3903 20.9994C12.221 21.0185 14.0248 20.5587 15.6228 19.6655C17.0235 20.4462 18.5843 20.8957 20.1856 20.9794C21.787 21.0631 23.3862 20.7789 24.8606 20.1484C26.3349 19.518 27.6453 18.5581 28.691 17.3426C29.7368 16.127 30.4901 14.688 30.8933 13.136C31.2964 11.5839 31.3387 9.96021 31.0167 8.38936C30.6947 6.8185 30.0172 5.34228 29.036 4.074C28.0548 2.80571 26.7961 1.77908 25.3565 1.07288C23.9169 0.366679 22.3346 -0.000386908 20.7311 8.28701e-07ZM12.8844 17.4532C12.1235 17.7255 11.3226 17.8692 10.5146 17.8785C8.5577 17.8785 6.68095 17.1012 5.29721 15.7174C3.91347 14.3337 3.1361 12.4569 3.1361 10.5C3.1361 8.54314 3.91347 6.66639 5.29721 5.28265C6.68095 3.89892 8.5577 3.12154 10.5146 3.12154C11.3227 3.13088 12.1235 3.27463 12.8844 3.54689C11.1756 5.45984 10.2311 7.93503 10.2311 10.5C10.2311 13.065 11.1756 15.5403 12.8844 17.4532ZM15.6228 15.8029C14.9054 15.1185 14.3342 14.2957 13.944 13.3842C13.5538 12.4727 13.3526 11.4915 13.3526 10.5C13.3526 9.50849 13.5538 8.52729 13.944 7.6158C14.3342 6.70431 14.9054 5.88148 15.6228 5.19713C16.3403 5.88148 16.9114 6.70431 17.3017 7.6158C17.6919 8.52729 17.8931 9.50849 17.8931 10.5C17.8931 11.4915 17.6919 12.4727 17.3017 13.3842C16.9114 14.2957 16.3403 15.1185 15.6228 15.8029ZM20.7311 17.8785C19.923 17.8691 19.1222 17.7254 18.3613 17.4532C20.0701 15.5402 21.0146 13.065 21.0146 10.5C21.0146 7.93503 20.0701 5.45984 18.3613 3.54689C19.1222 3.27463 19.923 3.13088 20.7311 3.12154C22.688 3.12154 24.5647 3.89892 25.9485 5.28265C27.3322 6.66639 28.1096 8.54314 28.1096 10.5C28.1096 12.4569 27.3322 14.3337 25.9485 15.7174C24.5647 17.1012 22.688 17.8785 20.7311 17.8785Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <LibroReclamacionesRedes />
                <div className="py-5 border-t-[1px] border-black dark:border-white"></div>

                <div className="flex justify-center w-full ">
                  <div className="flex justify-around w-full  text-xs  items-center mb-2">
                    <span>
                      Todos los derechos Reservados Fritz Sport{" "}
                      {date.getFullYear()}
                    </span>

                    <small className="mt-1">
                      Images are the property of Adidas and Nike ecommerce
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
