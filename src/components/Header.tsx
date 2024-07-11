type Prop = {
  withBackButton?: boolean;
};
export const Header = ({ withBackButton = false }: Prop) => {
  return (
    <header>
      {withBackButton && (
        <div className="p-4">
          <a href="/" className="cursor-poitner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.0}
              stroke="currentColor"
              className="size-6 text-blue-950 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </a>
        </div>
      )}
      <div
        className={
          "font-serif w-full text-blue-950 text-center pt-6 px-4 text-5xl " +
          (withBackButton ? "" : "pt-32")
        }
      >
        Does this time work for you?
      </div>
    </header>
  );
};
