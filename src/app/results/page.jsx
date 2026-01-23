// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const Results = () => {
//   const router = useRouter();
//   const [userProfile, setUserProfile] = useState(null);

//   useEffect(() => {
//     const stored = sessionStorage.getItem("userProfile");

//     if (!stored) {
//       router.push("/");
//     } else {
//       setUserProfile(JSON.parse(stored));
//     }
//   }, [router]);

//   if (!userProfile) {
//     return (
//       <div className="p-6 text-center">
//         <p>Loading results...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-8 bg-gray-50">
//       <h1 className="text-4xl font-bold mb-6">
//         Your Assessment Results
//       </h1>

//       {/* RAW PROFILE */}
//       <div className="bg-white rounded-xl p-6 shadow mb-8">
//         <h2 className="text-2xl font-semibold mb-4">
//           Raw Trait Scores
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {Object.entries(userProfile.traits).map(
//             ([trait, score]) => (
//               <div
//                 key={trait}
//                 className="p-4 border rounded-lg text-center"
//               >
//                 <p className="font-medium capitalize">
//                   {trait}
//                 </p>
//                 <p className="text-2xl font-bold text-blue-600">
//                   {score}
//                 </p>
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       {/* META */}
//       <div className="bg-white rounded-xl p-6 shadow">
//         <h2 className="text-2xl font-semibold mb-4">
//           Profile Summary
//         </h2>

//         <p>
//           <strong>Total Questions:</strong>{" "}
//           {userProfile.meta.totalQuestions}
//         </p>

//         <p>
//           <strong>Attempted:</strong>{" "}
//           {userProfile.meta.attempted}
//         </p>

//         <p>
//           <strong>Correct Aptitude:</strong>{" "}
//           {userProfile.meta.correctAptitude}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Results;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const ResultsPage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("aptitudeResult");

    if (!stored) {
      router.push("/aptitude");
      return;
    }

    setProfile(JSON.parse(stored));
  }, [router]);

  if (!profile) {
    return <div className="p-6">Loading results...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">
        Your Assessment Results
      </h1>

      {/* TRAITS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Core Traits
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(profile.traits).map(([trait, score]) => (
            <div
              key={trait}
              className="border rounded-lg p-4 text-center"
            >
              <p className="capitalize font-medium">{trait}</p>
              <p className="text-2xl font-bold text-blue-600">
                {score}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* META */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Test Summary
        </h2>

        <p>Total Questions: {profile.meta.totalQuestions}</p>
        <p>Attempted: {profile.meta.attempted}</p>
        <p>Correct Aptitude: {profile.meta.correctAptitude}</p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/aptitude")}
          className="px-6 py-3 bg-gray-200 rounded-xl"
        >
          Retake Test
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("aptitudeResult");
            router.push("/aptitude");
          }}
          className="px-6 py-3 bg-red-500 text-white rounded-xl"
        >
          Reset Result
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
