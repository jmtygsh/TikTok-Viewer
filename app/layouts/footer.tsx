export const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto w-full p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between ">
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center">
              <img
                src="/assets/logo.webp"
                className="h-8 me-3"
                alt="Anoview Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Anoview
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3">
            <div className="text-center">
              <h2 className="mb-6  font-semibold uppercase dark:text-white">
                Quick links
              </h2>
              <ul className="dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/trending-posts" className="hover:underline">
                    Get trending posts
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="/anonymous-tiktok-viewer"
                    className="hover:underline"
                  >
                    Anonymous tiktok viewer
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="/tiktok-video-downloader"
                    className="hover:underline"
                  >
                    Tiktok video downloader
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <h2 className="mb-6 font-semibold uppercase dark:text-white">
                Legal
              </h2>
              <ul className="dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <h2 className="mb-6  font-semibold uppercase dark:text-white">
                Follow us
              </h2>
              <ul className="dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a
                    href="https://github.com/jmtygsh"
                    className="hover:underline"
                  >
                    Github
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            <a href="/" className="hover:underline">
              Anoview
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
