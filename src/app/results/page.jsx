// // "use client";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";

// // const Results = () => {
// //   const router = useRouter();
// //   const [userProfile, setUserProfile] = useState(null);

// //   useEffect(() => {
// //     const stored = sessionStorage.getItem("userProfile");

// //     if (!stored) {
// //       router.push("/");
// //     } else {
// //       setUserProfile(JSON.parse(stored));
// //     }
// //   }, [router]);

// //   if (!userProfile) {
// //     return (
// //       <div className="p-6 text-center">
// //         <p>Loading results...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen p-8 bg-gray-50">
// //       <h1 className="text-4xl font-bold mb-6">
// //         Your Assessment Results
// //       </h1>

// //       {/* RAW PROFILE */}
// //       <div className="bg-white rounded-xl p-6 shadow mb-8">
// //         <h2 className="text-2xl font-semibold mb-4">
// //           Raw Trait Scores
// //         </h2>

// //         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// //           {Object.entries(userProfile.traits).map(
// //             ([trait, score]) => (
// //               <div
// //                 key={trait}
// //                 className="p-4 border rounded-lg text-center"
// //               >
// //                 <p className="font-medium capitalize">
// //                   {trait}
// //                 </p>
// //                 <p className="text-2xl font-bold text-blue-600">
// //                   {score}
// //                 </p>
// //               </div>
// //             )
// //           )}
// //         </div>
// //       </div>

// //       {/* META */}
// //       <div className="bg-white rounded-xl p-6 shadow">
// //         <h2 className="text-2xl font-semibold mb-4">
// //           Profile Summary
// //         </h2>

// //         <p>
// //           <strong>Total Questions:</strong>{" "}
// //           {userProfile.meta.totalQuestions}
// //         </p>

// //         <p>
// //           <strong>Attempted:</strong>{" "}
// //           {userProfile.meta.attempted}
// //         </p>

// //         <p>
// //           <strong>Correct Aptitude:</strong>{" "}
// //           {userProfile.meta.correctAptitude}
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Results;

// "use client";

// import { useAssessment } from "@/app/context/AssessmentContext";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";


// const ResultsPage = () => {
//   const router = useRouter();
//   const { rawTraits, normalizedTraits, userProfile } = useAssessment();

//   if (!userProfile) {
//     router.push("/aptitude");
//     return null;
//     // return <div className="p-6">Loading results...</div>;
//   }

//   console.log(rawTraits);
//   console.log(normalizedTraits);
//   console.log(userProfile.featureVector);

//   return (
//     <div className="min-h-screen p-8 bg-gray-50">
//       <h1 className="text-4xl font-bold mb-6">
//         Your Assessment Results
//       </h1>

//       {/* TRAITS */}
//       <div className="bg-white p-6 rounded-xl shadow mb-6">
//         <h2 className="text-2xl font-semibold mb-4">
//           Core Traits
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {Object.entries(rawTraits).map(([trait, score]) => ( 
//             <div
//               key={trait}
//               className="border rounded-lg p-4 text-center"
//             >
//               <p className="capitalize font-medium">{trait}</p>
//               <p className="text-2xl font-bold text-blue-600">
//                 {score}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* META */}
//       <div className="bg-white p-6 rounded-xl shadow mb-6">
//         <h2 className="text-2xl font-semibold mb-4">
//           Test Summary
//         </h2>

//         {/* <p>Total Questions: {profile.meta.totalQuestions}</p>
//         <p>Attempted: {profile.meta.attempted}</p>
//         <p>Correct Aptitude: {profile.meta.correctAptitude}</p> */}
//       </div>

//       {/* ACTIONS */}
//       <div className="flex gap-4">
//         <button
//           onClick={() => router.push("/aptitude")}
//           className="px-6 py-3 bg-gray-200 rounded-xl"
//         >
//           Retake Test
//         </button>

//         <button
//           onClick={() => {
//             localStorage.removeItem("aptitudeResult");
//             router.push("/aptitude");
//           }}
//           className="px-6 py-3 bg-red-500 text-white rounded-xl"
//         >
//           Reset Result
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ResultsPage;


"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAssessment } from "@/app/context/AssessmentContext";
import { generateResults } from "@/utils/generateResults";

const CareerBlock = ({ title, items }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-semibold mb-2">{title}</h4>
    <ul className="list-disc list-inside text-sm">
      {items.map((career) => (
        <li key={career}>{career}</li>
      ))}
    </ul>
  </div>
);

const ResultsPage = () => {
  const router = useRouter();
  const { rawTraits, normalizedTraits, userProfile } = useAssessment();

useEffect(() => {
  if (!userProfile) {
    router.push("/aptitude");
  }
}, [userProfile, router]);


if (!userProfile) {
  return <div className="p-6">Loading results...</div>;
}

// const TRAIT_ORDER = [
//   "logical",
//   "analytical",
//   "numerical",
//   "spatial",
//   "verbal",
//   "leadership",
//   "discipline",
//   "creativity",
//   "problem_solving",
//   "confidence"
// ];

// const userVector =
//   userProfile?.normalizedTraits &&
//   TRAIT_ORDER.map(
//     (trait) => userProfile.normalizedTraits[trait] ?? 0
//   );

const userVector = userProfile.featureVector;

const confidence =
  userProfile?.meta?.confidence ?? 0.5;

const clusterResults =
  generateResults(userVector, confidence);

  // const clusterResults =
  // userVector && generateResults(userVector);

  console.log(rawTraits);
  console.log(normalizedTraits);
  // console.log(userProfile.featureVector);
  console.log("VECTOR →", userProfile.featureVector);


  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">
        Your Assessment Results
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Core Traits
        </h2>

      <div className="space-y-2">
{userProfile?.normalizedTraits &&
  Object.entries(userProfile.normalizedTraits)
  .filter(([trait]) => trait !== "confidence").map(
    ([trait, score]) => (
      <div key={trait} className="flex justify-between">
        <span className="capitalize">
          {trait.replace("_", " ")}
        </span>
        <span>{Math.round(score * 100)}%</span>
      </div>
    )
)}

      </div>

      </div>

      {clusterResults && clusterResults.length > 0 && (
  <div className="bg-white p-6 rounded-xl shadow mt-8">
    <h2 className="text-2xl font-semibold mb-4">
      Career Recommendations
    </h2>

    {clusterResults.map((cluster) => (
      <div key={cluster.clusterId} className="mb-6">
        <h3 className="text-xl font-bold">
          {cluster.clusterName}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          Match Strength: {cluster.similarity}%
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CareerBlock title="Top Matches" items={cluster.careers.top} />
          <CareerBlock title="Moderate Matches" items={cluster.careers.moderate} />
          <CareerBlock title="Least Matches" items={cluster.careers.least} />
        </div>
      </div>
    ))}
  </div>
)}


      <div className="flex gap-4">
        <button
          onClick={() => router.push("/aptitude")}
          className="px-6 py-3 bg-gray-200 rounded-xl"
        >
          Retake Test
        </button>
      </div>

    </div>
  );
};


export default ResultsPage;
