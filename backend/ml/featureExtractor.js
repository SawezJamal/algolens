function extractFeatures(code, problem = null) {
    // =========================================================
    // NORMALIZE CODE
    // =========================================================

    const normalizedCode = String(code || "")
        // Remove single-line comments
        .replace(/\/\/.*$/gm, "")
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .trim();

    const lowerCode = normalizedCode.toLowerCase();

    // =========================================================
    // PROBLEM INFORMATION
    // =========================================================

    const problemTitle = (
        problem?.title || ""
    ).toLowerCase();

    const problemDescription = (
        problem?.description || ""
    ).toLowerCase();

    const problemCategories = Array.isArray(
        problem?.categories
    )
        ? problem.categories.map((category) =>
              String(category).toLowerCase()
          )
        : [];

    const problemText = [
        problemTitle,
        problemDescription,
        ...problemCategories,
    ].join(" ");

    // =========================================================
    // BASIC STRUCTURAL FEATURES
    // =========================================================

    const forLoops =
        (
            normalizedCode.match(
                /\bfor\s*\(/g
            ) || []
        ).length;

    const whileLoops =
        (
            normalizedCode.match(
                /\bwhile\s*\(/g
            ) || []
        ).length;

    const doWhileLoops =
        (
            normalizedCode.match(
                /\bdo\b[\s\S]{0,150}\bwhile\s*\(/g
            ) || []
        ).length;

    const loopCount =
        forLoops +
        whileLoops +
        doWhileLoops;

    // =========================================================
    // NESTED LOOP DETECTION
    // =========================================================

    const nestedLoops =
        /\bfor\s*\([^)]*\)[\s\S]{0,700}\bfor\s*\(/.test(
            normalizedCode
        ) ||
        /\bwhile\s*\([^)]*\)[\s\S]{0,700}\b(?:for|while)\s*\(/.test(
            normalizedCode
        ) ||
        /\bfor\s*\([^)]*\)[\s\S]{0,700}\bwhile\s*\(/.test(
            normalizedCode
        );

    // =========================================================
    // HASHING
    // =========================================================

    const hasHashMap =
        /\b(?:unordered_map|map)\s*</.test(
            normalizedCode
        );

    const hasHashSet =
        /\b(?:unordered_set|set)\s*</.test(
            normalizedCode
        );

    // =========================================================
    // FREQUENCY MAP
    // =========================================================

    const hasFrequencyMap =
        (
            /\b(?:count|freq|frequency|counter)\b/.test(
                lowerCode
            ) &&
            (
                hasHashMap ||
                hasHashSet
            )
        );

    // =========================================================
    // SORTING
    // =========================================================

    const hasSorting =
        /\bsort\s*\(/.test(
            normalizedCode
        ) ||
        /\bstable_sort\s*\(/.test(
            normalizedCode
        );

    // =========================================================
    // BINARY SEARCH
    // =========================================================

    const hasBinarySearch =
        /\b(?:binary_search|lower_bound|upper_bound)\s*\(/.test(
            normalizedCode
        ) ||
        (
            /\b(?:mid|middle)\b/.test(
                normalizedCode
            ) &&
            (
                /\blow\b/.test(
                    normalizedCode
                ) ||
                /\bleft\b/.test(
                    normalizedCode
                )
            ) &&
            (
                /\bhigh\b/.test(
                    normalizedCode
                ) ||
                /\bright\b/.test(
                    normalizedCode
                )
            )
        );

    // =========================================================
    // LINEAR SEARCH
    // =========================================================

    const hasLinearSearch =
        /\bfind\s*\(/.test(
            normalizedCode
        ) ||
        /\bfor\s*\([^)]*\)[\s\S]{0,300}(==|!=)/.test(
            normalizedCode
        );

    // =========================================================
    // ARRAYS / VECTORS
    // =========================================================

    const arrayAccesses =
        (
            normalizedCode.match(
                /\b\w+\s*\[[^\]]+\]/g
            ) || []
        ).length;

    const vectorDeclarations =
        (
            normalizedCode.match(
                /\bvector\s*</g
            ) || []
        ).length;

    const arraySizeCalls =
        (
            normalizedCode.match(
                /\b\w+\s*\.\s*(?:size|length)\s*\(\s*\)/g
            ) || []
        ).length;

    // =========================================================
    // RECURSION
    // =========================================================

    const hasRecursion = (() => {
        /*
         * Detect common C++ function declarations.
         *
         * Examples:
         *
         * int solve(...)
         * bool dfs(...)
         * void backtrack(...)
         * long long solve(...)
         * vector<int> solve(...)
         */

        const functionDeclarationRegex =
            /\b(?:int|bool|void|long\s+long|double|string|float|char|vector\s*<[^>]+>)\s+([A-Za-z_]\w*)\s*\([^)]*\)\s*\{/g;

        let match;

        while (
            (match =
                functionDeclarationRegex.exec(
                    normalizedCode
                )) !== null
        ) {
            const functionName = match[1];

            /*
             * Search after the function declaration.
             */

            const bodyStart =
                match.index + match[0].length;

            const body =
                normalizedCode.slice(
                    bodyStart
                );

            /*
             * Escape function name for RegExp.
             */

            const escapedName =
                functionName.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );

            const recursiveCallRegex =
                new RegExp(
                    `\\b${escapedName}\\s*\\(`
                );

            if (
                recursiveCallRegex.test(
                    body
                )
            ) {
                return true;
            }
        }

        return false;
    })();

    // =========================================================
    // MEMOIZATION
    // =========================================================

    const hasMemoization =
        /\b(?:memo|memoization|cache|cached)\b/i.test(
            normalizedCode
        );

    // =========================================================
    // DP ARRAY
    // =========================================================

    const hasDPArray =
        (
            /\b(?:vector\s*<[^>]+>|int|long\s+long)\s+\w+\s*\[[^\]]+\]/.test(
                normalizedCode
            ) ||
            /\bvector\s*<[^>]+>\s+\w+/.test(
                normalizedCode
            )
        ) &&
        (
            /\bdp\b/i.test(
                normalizedCode
            ) ||
            /\bmemo\b/i.test(
                normalizedCode
            ) ||
            /\btable\b/i.test(
                normalizedCode
            )
        );

    // =========================================================
    // TWO POINTERS
    // =========================================================

    const hasTwoPointers =
        (
            /\bleft\b/.test(
                lowerCode
            ) ||
            /\bi\b/.test(
                lowerCode
            )
        ) &&
        (
            /\bright\b/.test(
                lowerCode
            ) ||
            /\bj\b/.test(
                lowerCode
            )
        ) &&
        /\bwhile\s*\(/.test(
            normalizedCode
        );

    // =========================================================
    // SLIDING WINDOW
    // =========================================================

    const hasSlidingWindow =
        (
            /\bleft\b/.test(
                lowerCode
            ) ||
            /\bstart\b/.test(
                lowerCode
            )
        ) &&
        (
            /\bright\b/.test(
                lowerCode
            ) ||
            /\bend\b/.test(
                lowerCode
            )
        ) &&
        /\bwhile\s*\(/.test(
            normalizedCode
        );

    // =========================================================
    // PREFIX SUM
    // =========================================================

    const hasPrefixSum =
        /\b(?:prefix|prefixsum|prefix_sum)\b/i.test(
            normalizedCode
        ) ||
        /\bprefix\s*(?:sum|array)\b/i.test(
            problemText
        );

    // =========================================================
    // HEAP
    // =========================================================

    const hasHeap =
        /\bpriority_queue\b/.test(
            normalizedCode
        ) ||
        /\b(?:heap|priority)\b/i.test(
            normalizedCode
        );

    // =========================================================
    // GRAPH
    // =========================================================

    const hasGraphTraversal =
        (
            /\b(?:queue|stack)\b/.test(
                lowerCode
            )
        ) &&
        (
            /\bvisited\b/.test(
                lowerCode
            ) ||
            /\badj\b/.test(
                lowerCode
            ) ||
            /\badjacency\b/.test(
                lowerCode
            )
        );

    const hasDFS =
        /\bdfs\b/i.test(
            normalizedCode
        ) ||
        /\bdepth\s*first\b/i.test(
            problemText
        );

    const hasBFS =
        /\bbfs\b/i.test(
            normalizedCode
        ) ||
        /\bbreadth\s*first\b/i.test(
            problemText
        );

    // =========================================================
    // BACKTRACKING
    // =========================================================

    const hasBacktracking =
        hasRecursion &&
        (
            /\bpush_back\s*\(/.test(
                normalizedCode
            ) ||
            /\bpop_back\s*\(/.test(
                normalizedCode
            ) ||
            /\bpath\b/.test(
                lowerCode
            ) ||
            /\bcurrent\b/.test(
                lowerCode
            ) ||
            /\bchoice\b/.test(
                lowerCode
            )
        );

    // =========================================================
    // REPEATED WORK
    // =========================================================

    const hasSortingInsideLoop =
        /\b(?:for|while)\s*\([^)]*\)[\s\S]{0,700}\bsort\s*\(/.test(
            normalizedCode
        );

    const hasRepeatedTraversal =
        loopCount >= 2 &&
        arrayAccesses >= 2;

    // =========================================================
    // LOOP INVARIANT CANDIDATE
    // =========================================================

    const hasLoopInvariantCandidate =
        loopCount > 0 &&
        (
            /\b\w+\s*\.\s*(?:size|length)\s*\(\s*\)/.test(
                normalizedCode
            ) ||
            /\b(?:int|long\s+long|double)\s+\w+\s*=/.test(
                normalizedCode
            )
        );

    // =========================================================
    // RETURN VECTOR
    // =========================================================

    const returnVector =
        /\bvector\s*<\s*(?:int|long\s+long|string|double|float|bool|char)\s*>\s+\w+\s*\(/.test(
            normalizedCode
        ) ||
        /\bvector\s*<\s*int\s*>\s+\w+/.test(
            normalizedCode
        );

    // =========================================================
    // COMPLEXITY SIGNALS
    // =========================================================

    const hasQuadraticSignal =
        nestedLoops ||
        hasSortingInsideLoop;

    const hasLinearStructure =
        loopCount === 1 &&
        !nestedLoops;

    // =========================================================
    // PROBLEM CONTEXT FEATURES
    // =========================================================

    const problemHashing =
        problemCategories.includes(
            "hashing"
        ) ||
        /\b(?:hash|hashing|duplicate|anagram|frequency|frequency map)\b/i.test(
            problemText
        );

    const problemBinarySearch =
        problemCategories.includes(
            "binary search"
        ) ||
        /\bbinary search\b/i.test(
            problemText
        ) ||
        /\bsearch insert\b/i.test(
            problemText
        ) ||
        /\bsearch\b.*\bsorted\b/i.test(
            problemText
        );

    const problemSorting =
        problemCategories.includes(
            "sorting"
        ) ||
        /\b(?:sort|sorting|sorted)\b/i.test(
            problemText
        );

    const problemDynamicProgramming =
        problemCategories.includes(
            "dynamic programming"
        ) ||
        /\b(?:dynamic programming|coin change|knapsack|climbing stairs|house robber|longest common subsequence|lcs)\b/i.test(
            problemText
        );

    const problemTwoPointer =
        problemCategories.includes(
            "two pointers"
        ) ||
        /\btwo[-\s]?pointer/i.test(
            problemText
        );

    const problemSlidingWindow =
        problemCategories.includes(
            "sliding window"
        ) ||
        /\bsliding window\b/i.test(
            problemText
        );

    const problemHeap =
        problemCategories.includes(
            "heap"
        ) ||
        /\b(?:heap|priority queue|kth largest|kth smallest|top k)\b/i.test(
            problemText
        );

    const problemGraph =
        problemCategories.includes(
            "graphs"
        ) ||
        /\b(?:graph|graphs|dfs|bfs|shortest path|spanning tree|connected components)\b/i.test(
            problemText
        );

    const problemBacktracking =
        problemCategories.includes(
            "backtracking"
        ) ||
        /\b(?:backtracking|permutation|combination|subset|n[-\s]?queens)\b/i.test(
            problemText
        );

    const problemDuplicateDetection =
        /\bduplicate\b/i.test(
            problemText
        );

    const problemSearch =
        /\bsearch\b/i.test(
            problemText
        );

    // =========================================================
    // PAIR COMPARISON
    // =========================================================

    const hasPairComparison =
        nestedLoops &&
        (
            /\b\w+\s*\[[^\]]+\]\s*==\s*\w+\s*\[[^\]]+\]/.test(
                normalizedCode
            ) ||
            /\b\w+\s*(?:==|!=|<=|>=|<|>)\s*\w+/.test(
                normalizedCode
            )
        );

    // =========================================================
    // EXPLICIT HASHING
    // =========================================================

    const hasExplicitHashing =
        hasHashMap ||
        hasHashSet;

    // =========================================================
    // COMPLEMENT LOOKUP
    // =========================================================

    const hasComplementLookup =
        /\bcomplement\b/i.test(
            normalizedCode
        ) ||
        /\btarget\s*-\s*\w+/.test(
            normalizedCode
        ) ||
        /\b\w+\s*=\s*target\s*-\s*\w+/.test(
            normalizedCode
        );

    // =========================================================
    // DUPLICATE COMPARISON
    // =========================================================

    const hasDuplicateComparison =
        nestedLoops &&
        (
            /\b\w+\s*\[[^\]]+\]\s*==\s*\w+\s*\[[^\]]+\]/.test(
                normalizedCode
            ) ||
            /\b\w+\s*==\s*\w+/.test(
                normalizedCode
            )
        );

    // =========================================================
    // SORT THEN SEARCH
    // =========================================================

    const hasSortThenSearch =
        hasSorting &&
        (
            hasLinearSearch ||
            hasBinarySearch
        );

    // =========================================================
    // INDEX TRACKING
    // =========================================================

    const hasIndexTracking =
        (
            /\b\w+\s*\[[^\]]+\]\s*=\s*(?:i|j|index)/.test(
                normalizedCode
            ) ||
            /\b(?:index|idx)\b\s*=/.test(
                normalizedCode
            )
        ) &&
        (
            hasHashMap ||
            hasHashSet ||
            /\bindex\b/i.test(
                normalizedCode
            )
        );

    // =========================================================
    // SINGLE PASS AGGREGATION
    // =========================================================

    const hasSinglePassAggregation =
        loopCount === 1 &&
        !nestedLoops &&
        (
            /\bsum\b/i.test(
                normalizedCode
            ) ||
            /\bcount\b/i.test(
                normalizedCode
            ) ||
            /\bmin\b/i.test(
                normalizedCode
            ) ||
            /\bmax\b/i.test(
                normalizedCode
            )
        );

    // =========================================================
    // RETURN FEATURES
    //
    // IMPORTANT:
    // EXACTLY 46 FEATURES
    //
    // The order MUST match FEATURE_NAMES
    // in train_model.py and predict.py.
    //
    // DO NOT ADD hasSortedInput here unless
    // the model is retrained with 47 features.
    // =========================================================

    return {

        // =====================================================
        // CODE FEATURES — 27
        // =====================================================

        loopCount,

        nestedLoops:
            nestedLoops ? 1 : 0,

        hasHashMap:
            hasHashMap ? 1 : 0,

        hasHashSet:
            hasHashSet ? 1 : 0,

        hasSorting:
            hasSorting ? 1 : 0,

        hasBinarySearch:
            hasBinarySearch ? 1 : 0,

        arrayAccesses,

        returnVector:
            returnVector ? 1 : 0,

        hasLinearSearch:
            hasLinearSearch ? 1 : 0,

        hasRecursion:
            hasRecursion ? 1 : 0,

        hasMemoization:
            hasMemoization ? 1 : 0,

        hasDPArray:
            hasDPArray ? 1 : 0,

        hasTwoPointers:
            hasTwoPointers ? 1 : 0,

        hasSlidingWindow:
            hasSlidingWindow ? 1 : 0,

        hasPrefixSum:
            hasPrefixSum ? 1 : 0,

        hasHeap:
            hasHeap ? 1 : 0,

        hasGraphTraversal:
            hasGraphTraversal ? 1 : 0,

        hasDFS:
            hasDFS ? 1 : 0,

        hasBFS:
            hasBFS ? 1 : 0,

        hasBacktracking:
            hasBacktracking ? 1 : 0,

        hasSortingInsideLoop:
            hasSortingInsideLoop ? 1 : 0,

        hasRepeatedTraversal:
            hasRepeatedTraversal ? 1 : 0,

        hasLoopInvariantCandidate:
            hasLoopInvariantCandidate ? 1 : 0,

        hasQuadraticSignal:
            hasQuadraticSignal ? 1 : 0,

        hasLinearStructure:
            hasLinearStructure ? 1 : 0,

        vectorDeclarations,

        arraySizeCalls,

        // =====================================================
        // PROBLEM CONTEXT — 11
        // =====================================================

        problemHashing:
            problemHashing ? 1 : 0,

        problemBinarySearch:
            problemBinarySearch ? 1 : 0,

        problemSorting:
            problemSorting ? 1 : 0,

        problemDynamicProgramming:
            problemDynamicProgramming ? 1 : 0,

        problemTwoPointer:
            problemTwoPointer ? 1 : 0,

        problemSlidingWindow:
            problemSlidingWindow ? 1 : 0,

        problemHeap:
            problemHeap ? 1 : 0,

        problemGraph:
            problemGraph ? 1 : 0,

        problemBacktracking:
            problemBacktracking ? 1 : 0,

        problemDuplicateDetection:
            problemDuplicateDetection ? 1 : 0,

        problemSearch:
            problemSearch ? 1 : 0,

        // =====================================================
        // ADDITIONAL CODE SIGNALS — 8
        // =====================================================

        hasFrequencyMap:
            hasFrequencyMap ? 1 : 0,

        hasPairComparison:
            hasPairComparison ? 1 : 0,

        hasExplicitHashing:
            hasExplicitHashing ? 1 : 0,

        hasComplementLookup:
            hasComplementLookup ? 1 : 0,

        hasDuplicateComparison:
            hasDuplicateComparison ? 1 : 0,

        hasSortThenSearch:
            hasSortThenSearch ? 1 : 0,

        hasIndexTracking:
            hasIndexTracking ? 1 : 0,

        hasSinglePassAggregation:
            hasSinglePassAggregation ? 1 : 0,
    };
}

module.exports = extractFeatures;