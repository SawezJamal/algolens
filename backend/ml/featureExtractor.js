function extractFeatures(code) {
    const normalizedCode = code
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "");

    const forLoops =
        (normalizedCode.match(/\bfor\s*\(/g) || []).length;

    const whileLoops =
        (normalizedCode.match(/\bwhile\s*\(/g) || []).length;

    const loopCount = forLoops + whileLoops;

    const nestedLoops =
        /\bfor\s*\([^)]*\)[\s\S]{0,500}\bfor\s*\(/.test(
            normalizedCode
        ) ||
        /\bwhile\s*\([^)]*\)[\s\S]{0,500}\b(for|while)\s*\(/.test(
            normalizedCode
        );

    const hasHashMap =
        /\b(unordered_map|map)\b/.test(
            normalizedCode
        );

    const hasHashSet =
        /\b(unordered_set|set)\b/.test(
            normalizedCode
        );

    const hasSorting =
        /\bsort\s*\(/.test(normalizedCode);

    const hasBinarySearch =
        /\b(binary_search|lower_bound|upper_bound)\s*\(/.test(
            normalizedCode
        ) ||
        /\b(mid|middle)\b/.test(normalizedCode);

    const arrayAccesses =
        (normalizedCode.match(/\w+\s*\[[^\]]+\]/g) || [])
            .length;

    const returnVector =
        /\bvector\s*<\s*int\s*>\s+\w+\s*\(/.test(
            normalizedCode
        );

    return {
        loopCount,
        nestedLoops: nestedLoops ? 1 : 0,
        hasHashMap: hasHashMap ? 1 : 0,
        hasHashSet: hasHashSet ? 1 : 0,
        hasSorting: hasSorting ? 1 : 0,
        hasBinarySearch: hasBinarySearch ? 1 : 0,
        arrayAccesses,
        returnVector: returnVector ? 1 : 0,
    };
}

module.exports = extractFeatures;