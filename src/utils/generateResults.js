import { clusters } from "./clusters";
import { cosineSimilarity } from "./similarity";

clusters.forEach((c) => {
  if (!Array.isArray(c.vector)) {
    console.error("BROKEN CLUSTER:", c);
    throw new Error(`Cluster ${c.id} has no valid vector`);
  }
});


export function generateResults(userVector) {
  if (!Array.isArray(userVector)) return [];

  const results = clusters.map(cluster => {
    const similarity =
      cosineSimilarity(userVector, cluster.vector) || 0;

    return {
      clusterId: cluster.id,
      clusterName: cluster.name,
      similarity: Number((similarity * 100).toFixed(1)),
      careers: cluster.careers,
    };
  })
    .filter(r => r.similarity >= 55)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 2);

  return results;
}
