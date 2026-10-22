import sys
import json
import pickle
import os


# ==========================================================
# MODEL
# ==========================================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "efficiency_model.pkl"
)


try:

    with open(
        MODEL_PATH,
        "rb"
    ) as file:

        model = pickle.load(file)

except Exception as error:

    print(
        json.dumps({
            "error": f"Failed to load model: {error}"
        })
    )

    sys.exit(1)


# ==========================================================
# INPUT
# ==========================================================

try:

    features = json.load(
        sys.stdin
    )

except Exception as error:

    print(
        json.dumps({
            "error": f"Invalid feature input: {error}"
        })
    )

    sys.exit(1)


# ==========================================================
# FEATURE ORDER
# ==========================================================
#
# MUST EXACTLY MATCH:
#
# 1. featureExtractor.js
# 2. train_model.py
#
# Total: 46 features
# ==========================================================

FEATURE_NAMES = [

    # ======================================================
    # CODE FEATURES
    # ======================================================

    "loopCount",
    "nestedLoops",
    "hasHashMap",
    "hasHashSet",
    "hasSorting",
    "hasBinarySearch",
    "arrayAccesses",
    "returnVector",

    "hasLinearSearch",
    "hasRecursion",
    "hasMemoization",
    "hasDPArray",

    "hasTwoPointers",
    "hasSlidingWindow",
    "hasPrefixSum",

    "hasHeap",

    "hasGraphTraversal",
    "hasDFS",
    "hasBFS",

    "hasBacktracking",

    "hasSortingInsideLoop",
    "hasRepeatedTraversal",
    "hasLoopInvariantCandidate",

    "hasQuadraticSignal",
    "hasLinearStructure",

    "vectorDeclarations",
    "arraySizeCalls",

    # ======================================================
    # PROBLEM CONTEXT
    # ======================================================

    "problemHashing",
    "problemBinarySearch",
    "problemSorting",
    "problemDynamicProgramming",
    "problemTwoPointer",
    "problemSlidingWindow",
    "problemHeap",
    "problemGraph",
    "problemBacktracking",
    "problemDuplicateDetection",
    "problemSearch",

    # ======================================================
    # ADDITIONAL CODE SIGNALS
    # ======================================================

    "hasFrequencyMap",
    "hasPairComparison",
    "hasExplicitHashing",
    "hasComplementLookup",
    "hasDuplicateComparison",
    "hasSortThenSearch",
    "hasIndexTracking",
    "hasSinglePassAggregation",
]


# ==========================================================
# FEATURE COUNT VALIDATION
# ==========================================================

EXPECTED_FEATURE_COUNT = 46


if len(FEATURE_NAMES) != EXPECTED_FEATURE_COUNT:

    print(
        json.dumps({
            "error": (
                f"Internal feature configuration error: "
                f"FEATURE_NAMES contains {len(FEATURE_NAMES)} "
                f"features, expected {EXPECTED_FEATURE_COUNT}."
            )
        })
    )

    sys.exit(1)


# ==========================================================
# INPUT VALIDATION
# ==========================================================

if not isinstance(features, dict):

    print(
        json.dumps({
            "error": "Feature input must be a JSON object."
        })
    )

    sys.exit(1)


# ==========================================================
# CHECK MISSING FEATURES
# ==========================================================

missing = [
    name
    for name in FEATURE_NAMES
    if name not in features
]


if missing:

    print(
        json.dumps({
            "error": "Missing ML features",
            "missing": missing,
        })
    )

    sys.exit(1)


# ==========================================================
# BUILD FEATURE VECTOR
# ==========================================================
#
# IMPORTANT:
# The order here MUST remain identical to
# FEATURE_NAMES and train_model.py.
#
# ==========================================================

try:

    feature_vector = [[
        features[name]
        for name in FEATURE_NAMES
    ]]

except Exception as error:

    print(
        json.dumps({
            "error": f"Failed to build feature vector: {error}"
        })
    )

    sys.exit(1)


# ==========================================================
# FEATURE VECTOR LENGTH VALIDATION
# ==========================================================

if len(feature_vector[0]) != EXPECTED_FEATURE_COUNT:

    print(
        json.dumps({
            "error": (
                f"Feature vector contains "
                f"{len(feature_vector[0])} features, "
                f"expected {EXPECTED_FEATURE_COUNT}."
            )
        })
    )

    sys.exit(1)


# ==========================================================
# CONVERT FEATURES TO NUMERIC VALUES
# ==========================================================

try:

    feature_vector = [
        [
            float(value)
            for value in feature_vector[0]
        ]
    ]

except Exception as error:

    print(
        json.dumps({
            "error": (
                f"Feature values must be numeric: "
                f"{error}"
            )
        })
    )

    sys.exit(1)


# ==========================================================
# PREDICTION
# ==========================================================

try:

    prediction = model.predict(
        feature_vector
    )[0]

    probabilities = model.predict_proba(
        feature_vector
    )[0]

except Exception as error:

    print(
        json.dumps({
            "error": f"Prediction failed: {error}"
        })
    )

    sys.exit(1)


# ==========================================================
# CONFIDENCE
# ==========================================================

confidence = round(
    float(
        max(probabilities)
    ) * 100,
    2
)


# ==========================================================
# LABELS
# ==========================================================

LABELS = {

    0: "Efficient",

    1: "Hashing Opportunity",

    2: "Binary Search Opportunity",

    3: "Nested Loop Optimization",

    4: "Sorting Optimization",

    5: "Dynamic Programming / Memoization",

    6: "Two Pointer / Sliding Window",

    7: "Heap Optimization",

    8: "Graph Traversal",

    9: "Backtracking / Recursion",

}


# ==========================================================
# PREDICTION LABEL
# ==========================================================

prediction_class = int(
    prediction
)


prediction_label = LABELS.get(
    prediction_class,
    "Unknown"
)


# ==========================================================
# RESULT
# ==========================================================

result = {

    "prediction": prediction_label,

    "predictionClass": prediction_class,

    "confidence": confidence,

}


# ==========================================================
# OUTPUT
# ==========================================================

print(
    json.dumps(
        result
    )
)