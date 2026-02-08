import Image from "next/image";

type Props = {
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  userName?: string;
  onAction: () => void;
};

const toTitleCase = (name: string) =>
  name
    .toLowerCase()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function DashboardBanner({
  status,
  userName = "there",
  onAction,
}: Props) {
  const displayName = toTitleCase(userName);

  const content = {
    NOT_STARTED: {
      title: (
        <>
          Welcome, {displayName} 👋
          <br />
          Discover Your Ideal Career Path 🚀
        </>
      ),
      subtitle:
        "Take our aptitude test to unlock personalized career recommendations made just for you.",
      button: "Start Aptitude Test",
      image: "/career-growth.webp",
    },

    IN_PROGRESS: {
      title: (
        <>
          Welcome, {displayName} 👋
          <br />
          You’re Almost There ⏳
        </>
      ),
      subtitle: "Resume your aptitude test to unlock your full career insights.",
      button: "Resume Test",
      image: "/career-growth.webp",
    },

    COMPLETED: {
      title: (
        <>
          Welcome, {displayName} 👋
          <br />
          Your Career Insights Are Ready 🎯
        </>
      ),
      subtitle: "Explore careers that match your strengths and skills.",
      button: "Explore Careers",
      image: "/career-growth.webp",
    },
  };

  const { title, subtitle, button, image } = content[status];

  return (
    <div className="mb-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100 p-10">
        
        {/* Decorative blur */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-200 blur-3xl opacity-40" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold mb-3 leading-snug">
              {title}
            </h2>

            <p className="text-gray-600 text-lg mb-6">
              {subtitle}
            </p>

            <button
              onClick={onAction}
              className="bg-black text-white px-8 py-3 rounded-xl text-base font-medium hover:opacity-90 transition"
            >
              {button}
            </button>
          </div>

          {/* Image */}
          <div className="hidden md:flex justify-end">
            <Image
              src={image}
              alt="Career guidance illustration"
              width={360}
              height={260}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
