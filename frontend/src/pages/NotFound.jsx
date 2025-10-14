import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="text-center w-full max-w-md">
                <img
                    src="/img/404.webp"
                    alt="404"
                    className="mx-auto mb-4 h-48 w-48 sm:h-64 sm:w-64"
                />
                <h2 className="mt-4 text-xl font-semibold text-gray-600 sm:text-2xl">
                    Page Not Found
                </h2>
                <p className="mt-2 mb-6 text-gray-500 text-sm sm:text-base">
                    Sorry, the page you are looking for doesn't exist.
                </p>
                <Link
                    to="/"
                    className="inline-block rounded bg-violet-500 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-violet-600 text-sm sm:text-base"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;