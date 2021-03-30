import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ActiveLink } from "./ActiveLink";

export function Navigation() {
  const router = useRouter();

  return (
    <nav className="bg-gray-800 sticky top-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center px-2 lg:px-0">
            <div className="flex-shrink-0">
              <Link href="/">
                <a>
                  <Image
                    width={48}
                    height={48}
                    layout="fixed"
                    className="block rounded-full overflow-hidden"
                    src="/images/happy.png"
                    alt="Revolution"
                  />
                </a>
              </Link>
            </div>
            <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const address = (e.currentTarget.elements.namedItem(
                      "address"
                    ) as HTMLInputElement).value;

                    if (address) {
                      router.push(`/collections/${address}`);
                    }
                  }}
                >
                  <label htmlFor="search" className="sr-only">
                    Address
                  </label>
                  <div className="relative">
                    <button className="absolute inset-y-0 left-0 px-3 flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <input
                      id="address"
                      name="address"
                      className="block w-full pl-11 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm"
                      placeholder="Enter Address"
                      type="search"
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="hidden lg:block lg:ml-6">
              <div className="flex space-x-4">
                <MenuLink href="/" title="Sales" exact />
                <MenuLink href="/collections" title="Collections" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MenuLink({ title, href, exact = false }) {
  return (
    <ActiveLink
      href={href}
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium"
      activeClassName="bg-gray-900 text-white px-3 py-2 rounded-md font-medium"
      exact={exact}
    >
      {title}
    </ActiveLink>
  );
}
