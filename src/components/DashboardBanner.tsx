import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function DashboardBanner({ status, userName = "there", onAction }: Props) {
  const router = useRouter();
  const [hasResult, setHasResult] = useState(false);
  const displayName = toTitleCase(userName);

  useEffect(() => {
    const stored = localStorage.getItem("wdig_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHasResult(!!parsed?.prediction);
      } catch {
        setHasResult(false);
      }
    }
  }, []);

  const content = {
    NOT_STARTED: {
      title: (
        <>
          Welcome, {displayName} 👋
          <br />
          Discover Your Ideal Career Path 🚀
        </>
      ),
      subtitle: "Take our aptitude test to unlock personalized career recommendations made just for you.",
      image: "/career-growth.webp",
    },
    IN_PROGRESS: {
      title: (
        <>
          Welcome, {displayName} 👋
          <br />
          You're Almost There ⏳
        </>
      ),
      subtitle: "Resume your aptitude test to unlock your full career insights.",
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
      image: "/career-growth.webp",
    },
  };

  const { title, subtitle, image } = content[status];

  return (
    <div className="mb-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100 p-10">
        
        {/* Decorative blur */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-200 blur-3xl opacity-40" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold mb-3 leading-snug">{title}</h2>
            <p className="text-gray-600 text-lg mb-6">{subtitle}</p>

            <div className="flex justify-center">
              {hasResult ? (
                <button
                  onClick={() => router.push("/results")}
                  className="px-8 py-3 text-lg font-semibold bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition"
                >
                  View My Results
                </button>
              ) : (
                <button
                  onClick={() => router.push("/aptitude")}
                  className="px-20 py-3 text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:opacity-90 transition"
                >
                  Take Aptitude Test
                  <Image
                    src="/assets/test.png"
                    alt="Arrow Right"
                    width={40}
                    height={40}
                    className="inline-block ml-2"
                  />
                </button>
              )}
            </div>
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