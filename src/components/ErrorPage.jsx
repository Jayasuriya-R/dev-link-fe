const ErrorPage = ({ error, resetErrorBoundary }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-base-100 shadow-xl rounded-xl p-6 w-[90%] max-w-sm text-center border border-base-300">
        <h2 className="text-2xl font-bold text-error mb-2">
          Something went wrong
        </h2>
        <p className="text-base-content opacity-80 mb-4">
          {error?.message || "Unexpected error occurred"}
        </p>

        <button
          className="btn btn-primary btn-wide"
          onClick={() => {
            resetErrorBoundary();
            window.location.reload();
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
