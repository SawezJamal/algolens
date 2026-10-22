from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
)
import pickle
import os


# ==========================================================
# FEATURE ORDER
# ==========================================================
#
# MUST EXACTLY MATCH featureExtractor.js
#
# Total: 46 features
# ==========================================================

FEATURE_NAMES = [
    # ======================================================
    # Code features
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
    # Problem context
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
    # Additional code signals
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
# HELPER
# ==========================================================

def row(
    loopCount=0,
    nestedLoops=0,
    hasHashMap=0,
    hasHashSet=0,
    hasSorting=0,
    hasBinarySearch=0,
    arrayAccesses=0,
    returnVector=0,

    hasLinearSearch=0,
    hasRecursion=0,
    hasMemoization=0,
    hasDPArray=0,

    hasTwoPointers=0,
    hasSlidingWindow=0,
    hasPrefixSum=0,

    hasHeap=0,

    hasGraphTraversal=0,
    hasDFS=0,
    hasBFS=0,

    hasBacktracking=0,

    hasSortingInsideLoop=0,
    hasRepeatedTraversal=0,
    hasLoopInvariantCandidate=0,

    hasQuadraticSignal=0,
    hasLinearStructure=0,

    vectorDeclarations=0,
    arraySizeCalls=0,

    # ======================================================
    # Problem context
    # ======================================================

    problemHashing=0,
    problemBinarySearch=0,
    problemSorting=0,
    problemDynamicProgramming=0,
    problemTwoPointer=0,
    problemSlidingWindow=0,
    problemHeap=0,
    problemGraph=0,
    problemBacktracking=0,
    problemDuplicateDetection=0,
    problemSearch=0,

    # ======================================================
    # Additional code signals
    # ======================================================

    hasFrequencyMap=0,
    hasPairComparison=0,
    hasExplicitHashing=0,
    hasComplementLookup=0,
    hasDuplicateComparison=0,
    hasSortThenSearch=0,
    hasIndexTracking=0,
    hasSinglePassAggregation=0,
):
    return [
        # ==================================================
        # Code features
        # ==================================================

        loopCount,
        nestedLoops,
        hasHashMap,
        hasHashSet,
        hasSorting,
        hasBinarySearch,
        arrayAccesses,
        returnVector,

        hasLinearSearch,
        hasRecursion,
        hasMemoization,
        hasDPArray,

        hasTwoPointers,
        hasSlidingWindow,
        hasPrefixSum,

        hasHeap,

        hasGraphTraversal,
        hasDFS,
        hasBFS,

        hasBacktracking,

        hasSortingInsideLoop,
        hasRepeatedTraversal,
        hasLoopInvariantCandidate,

        hasQuadraticSignal,
        hasLinearStructure,

        vectorDeclarations,
        arraySizeCalls,

        # ==================================================
        # Problem context
        # ==================================================

        problemHashing,
        problemBinarySearch,
        problemSorting,
        problemDynamicProgramming,
        problemTwoPointer,
        problemSlidingWindow,
        problemHeap,
        problemGraph,
        problemBacktracking,
        problemDuplicateDetection,
        problemSearch,

        # ==================================================
        # Additional code signals
        # ==================================================

        hasFrequencyMap,
        hasPairComparison,
        hasExplicitHashing,
        hasComplementLookup,
        hasDuplicateComparison,
        hasSortThenSearch,
        hasIndexTracking,
        hasSinglePassAggregation,
    ]


# ==========================================================
# LABELS
# ==========================================================

CLASS_NAMES = {
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
# TRAINING DATA
# ==========================================================

X = []
y = []


# ==========================================================
# CLASS 0
# EFFICIENT
# ==========================================================

efficient_examples = [

    # Hash-based efficient solution

    row(
        loopCount=1,
        hasHashMap=1,
        hasExplicitHashing=1,
        hasIndexTracking=1,
        hasLinearStructure=1,
        problemHashing=1,
    ),

    row(
        loopCount=1,
        hasHashSet=1,
        hasExplicitHashing=1,
        hasSinglePassAggregation=1,
        hasLinearStructure=1,
        problemHashing=1,
        problemDuplicateDetection=1,
    ),

    row(
        loopCount=1,
        hasHashMap=1,
        arrayAccesses=2,
        hasLinearStructure=1,
        problemHashing=1,
        hasExplicitHashing=1,
        hasFrequencyMap=1,
    ),

    row(
        loopCount=1,
        hasHashMap=1,
        hasComplementLookup=1,
        hasIndexTracking=1,
        problemHashing=1,
        hasExplicitHashing=1,
    ),

    # Efficient binary search

    row(
        loopCount=1,
        hasBinarySearch=1,
        arrayAccesses=2,
        hasLinearStructure=1,
        problemBinarySearch=1,
        problemSearch=1,
    ),

    row(
        loopCount=1,
        hasBinarySearch=1,
        arrayAccesses=3,
        hasLinearStructure=1,
        problemBinarySearch=1,
        problemSearch=1,
    ),

    row(
        loopCount=1,
        hasBinarySearch=1,
        arrayAccesses=4,
        hasLinearStructure=1,
        problemBinarySearch=1,
        problemSearch=1,
    ),

    # Efficient sorting

    row(
        loopCount=1,
        hasSorting=1,
        arrayAccesses=2,
        hasLinearStructure=1,
        problemSorting=1,
    ),

    row(
        loopCount=1,
        hasSorting=1,
        arrayAccesses=3,
        hasLinearStructure=1,
        problemSorting=1,
    ),

    # Simple linear traversal

    row(
        loopCount=1,
        arrayAccesses=2,
        hasLinearStructure=1,
    ),

    row(
        loopCount=1,
        arrayAccesses=3,
        hasLinearStructure=1,
        hasSinglePassAggregation=1,
    ),

    row(
        loopCount=1,
        arrayAccesses=4,
        hasLinearStructure=1,
    ),

    row(
        loopCount=1,
        arrayAccesses=5,
        hasLinearStructure=1,
    ),

    # Efficient DP

    row(
        loopCount=2,
        hasMemoization=1,
        hasDPArray=1,
        arrayAccesses=3,
        problemDynamicProgramming=1,
    ),

    row(
        loopCount=2,
        hasMemoization=1,
        hasDPArray=1,
        arrayAccesses=4,
        problemDynamicProgramming=1,
    ),

    # Efficient two pointers

    row(
        loopCount=1,
        hasTwoPointers=1,
        arrayAccesses=3,
        hasLinearStructure=1,
        problemTwoPointer=1,
    ),

    row(
        loopCount=1,
        hasTwoPointers=1,
        arrayAccesses=4,
        hasLinearStructure=1,
        problemTwoPointer=1,
    ),

    # Efficient sliding window

    row(
        loopCount=1,
        hasSlidingWindow=1,
        arrayAccesses=3,
        hasLinearStructure=1,
        problemSlidingWindow=1,
    ),

    row(
        loopCount=1,
        hasSlidingWindow=1,
        arrayAccesses=4,
        hasLinearStructure=1,
        problemSlidingWindow=1,
    ),

    # Efficient prefix sum

    row(
        loopCount=1,
        hasPrefixSum=1,
        arrayAccesses=3,
        hasLinearStructure=1,
    ),

    # Efficient heap

    row(
        loopCount=1,
        hasHeap=1,
        arrayAccesses=2,
        hasLinearStructure=1,
        problemHeap=1,
    ),

    row(
        loopCount=2,
        hasHeap=1,
        arrayAccesses=3,
        problemHeap=1,
    ),

    # Efficient graph traversal

    row(
        loopCount=2,
        hasGraphTraversal=1,
        hasBFS=1,
        problemGraph=1,
    ),

    row(
        loopCount=2,
        hasGraphTraversal=1,
        hasDFS=1,
        hasRecursion=1,
        problemGraph=1,
    ),

    row(
        loopCount=3,
        hasGraphTraversal=1,
        hasBFS=1,
        arrayAccesses=4,
        problemGraph=1,
    ),

    # Efficient backtracking

    row(
        loopCount=1,
        hasRecursion=1,
        hasBacktracking=1,
        problemBacktracking=1,
    ),

    row(
        loopCount=2,
        hasRecursion=1,
        hasBacktracking=1,
        arrayAccesses=3,
        problemBacktracking=1,
    ),
]


for example in efficient_examples:
    X.append(example)
    y.append(0)


# ==========================================================
# CLASS 1
# HASHING OPPORTUNITY
# ==========================================================

hashing_examples = [

    # Duplicate detection

    row(
        loopCount=2,
        nestedLoops=1,
        arrayAccesses=4,
        hasQuadraticSignal=1,
        hasRepeatedTraversal=1,
        hasLoopInvariantCandidate=1,
        problemHashing=1,
        problemDuplicateDetection=1,
        hasPairComparison=1,
        hasDuplicateComparison=1,
    ),

    row(
        loopCount=2,
        nestedLoops=1,
        arrayAccesses=5,
        hasQuadraticSignal=1,
        hasRepeatedTraversal=1,
        problemHashing=1,
        problemDuplicateDetection=1,
        hasPairComparison=1,
        hasDuplicateComparison=1,
    ),

    row(
        loopCount=2,
        nestedLoops=1,
        arrayAccesses=6,
        hasQuadraticSignal=1,
        problemHashing=1,
        problemDuplicateDetection=1,
        hasPairComparison=1,
        hasDuplicateComparison=1,
    ),

    # Frequency / counting

    row(
        loopCount=2,
        nestedLoops=1,
        arrayAccesses=4,
        hasQuadraticSignal=1,
        problemHashing=1,
        hasPairComparison=1,
    ),

    row(
        loopCount=2,
        nestedLoops=1,
        arrayAccesses=5,
        hasQuadraticSignal=1,
        problemHashing=1,
        hasRepeatedTraversal=1,
    ),

    row(
        loopCount=2,
        nestedLoops=1,
        arrayAccesses=6,
        hasQuadraticSignal=1,
        problemHashing=1,
        hasRepeatedTraversal=1,
    ),

    # Pair lookup / Two Sum

    row(
        loopCount=2,
        nestedLoops=1,
        arrayAccesses=4,
        hasQuadraticSignal=1,
        hasRepeatedTraversal=1,
        problemHashing=1,
        hasPairComparison=1,
        hasComplementLookup=1,
        hasIndexTracking=1,
    ),

    row(
        loopCount=3,
        nestedLoops=1,
        arrayAccesses=6,
        hasQuadraticSignal=1,
        hasRepeatedTraversal=1,
        problemHashing=1,
        hasPairComparison=1,
        hasComplementLookup=1,
    ),

    # Generic lookup

    row(
        loopCount=2,
        nestedLoops=1,
        arrayAccesses=5,
        hasQuadraticSignal=1,
        hasRepeatedTraversal=1,
        problemHashing=1,
    ),
]


for example in hashing_examples:
    X.append(example)
    y.append(1)


# ==========================================================
# CLASS 2
# BINARY SEARCH OPPORTUNITY
# ==========================================================

binary_search_examples = [

    # Linear search

    row(
        loopCount=1,
        hasLinearSearch=1,
        arrayAccesses=3,
        hasLinearStructure=1,
        problemBinarySearch=1,
        problemSearch=1,
    ),

    row(
        loopCount=1,
        hasLinearSearch=1,
        arrayAccesses=4,
        hasLinearStructure=1,
        problemBinarySearch=1,
        problemSearch=1,
    ),

    row(
        loopCount=1,
        hasLinearSearch=1,
        arrayAccesses=5,
        hasLinearStructure=1,
        problemBinarySearch=1,
        problemSearch=1,
    ),

    # Sorting + linear search

    row(
        loopCount=1,
        hasLinearSearch=1,
        hasSorting=1,
        arrayAccesses=3,
        problemBinarySearch=1,
        problemSearch=1,
        hasSortThenSearch=1,
    ),

    row(
        loopCount=2,
        hasLinearSearch=1,
        hasSorting=1,
        arrayAccesses=4,
        problemBinarySearch=1,
        problemSearch=1,
        hasSortThenSearch=1,
    ),

    # Repeated search

    row(
        loopCount=2,
        hasLinearSearch=1,
        arrayAccesses=4,
        hasRepeatedTraversal=1,
        problemBinarySearch=1,
        problemSearch=1,
    ),

    row(
        loopCount=3,
        hasLinearSearch=1,
        arrayAccesses=6,
        hasRepeatedTraversal=1,
        problemBinarySearch=1,
        problemSearch=1,
    ),

    row(
        loopCount=3,
        hasLinearSearch=1,
        arrayAccesses=7,
        hasRepeatedTraversal=1,
        problemBinarySearch=1,
        problemSearch=1,
    ),
]


for example in binary_search_examples:
    X.append(example)
    y.append(2)


# ==========================================================
# CLASS 3
# NESTED LOOP OPTIMIZATION
# ==========================================================

nested_loop_examples = [

    row(
        loopCount=2,
        nestedLoops=1,
        arrayAccesses=5,
        hasQuadraticSignal=1,
        hasRepeatedTraversal=1,
        hasPairComparison=1,
    ),

    row(
        loopCount=3,
        nestedLoops=1,
        arrayAccesses=6,
        hasQuadraticSignal=1,
        hasRepeatedTraversal=1,
    ),

    row(
        loopCount=3,
        nestedLoops=1,
        arrayAccesses=8,
        hasQuadraticSignal=1,
        hasRepeatedTraversal=1,
    ),

    row(
        loopCount=4,
        nestedLoops=1,
        arrayAccesses=8,
        hasQuadraticSignal=1,
        hasRepeatedTraversal=1,
    ),

    row(
        loopCount=2,
        nestedLoops=1,
        arrayAccesses=6,
        hasQuadraticSignal=1,
    ),

    row(
        loopCount=3,
        nestedLoops=1,
        arrayAccesses=7,
        hasQuadraticSignal=1,
    ),

    row(
        loopCount=4,
        nestedLoops=1,
        arrayAccesses=10,
        hasQuadraticSignal=1,
        hasRepeatedTraversal=1,
    ),
]


for example in nested_loop_examples:
    X.append(example)
    y.append(3)


# ==========================================================
# CLASS 4
# SORTING OPTIMIZATION
# ==========================================================

sorting_examples = [

    row(
        loopCount=1,
        hasSorting=1,
        hasSortingInsideLoop=1,
        hasQuadraticSignal=1,
        problemSorting=1,
    ),

    row(
        loopCount=2,
        hasSorting=1,
        hasSortingInsideLoop=1,
        hasQuadraticSignal=1,
        problemSorting=1,
    ),

    row(
        loopCount=3,
        hasSorting=1,
        hasSortingInsideLoop=1,
        hasQuadraticSignal=1,
        problemSorting=1,
    ),

    row(
        loopCount=2,
        hasSorting=1,
        hasSortingInsideLoop=1,
        problemSorting=1,
    ),

    row(
        loopCount=3,
        hasSorting=1,
        hasSortingInsideLoop=1,
        problemSorting=1,
    ),
]


for example in sorting_examples:
    X.append(example)
    y.append(4)


# ==========================================================
# CLASS 5
# DYNAMIC PROGRAMMING / MEMOIZATION
# ==========================================================

dp_examples = [

    # Recursive DP without memoization

    row(
        loopCount=0,
        hasRecursion=1,
        problemDynamicProgramming=1,
    ),

    row(
        loopCount=1,
        hasRecursion=1,
        hasMemoization=0,
        problemDynamicProgramming=1,
    ),

    row(
        loopCount=2,
        hasRecursion=1,
        hasDPArray=0,
        problemDynamicProgramming=1,
    ),

    row(
        loopCount=1,
        hasRecursion=1,
        hasDPArray=0,
        problemDynamicProgramming=1,
        hasRepeatedTraversal=1,
    ),

    row(
        loopCount=2,
        hasRecursion=1,
        problemDynamicProgramming=1,
        hasRepeatedTraversal=1,
    ),

    row(
        loopCount=2,
        hasRecursion=1,
        problemDynamicProgramming=1,
        hasQuadraticSignal=1,
    ),

    row(
        loopCount=3,
        hasRecursion=1,
        problemDynamicProgramming=1,
        hasRepeatedTraversal=1,
    ),
]


for example in dp_examples:
    X.append(example)
    y.append(5)


# ==========================================================
# CLASS 6
# TWO POINTER / SLIDING WINDOW
# ==========================================================

two_pointer_examples = [

    # Two pointers

    row(
        loopCount=1,
        hasTwoPointers=1,
        arrayAccesses=3,
        hasLinearStructure=1,
        problemTwoPointer=1,
    ),

    row(
        loopCount=1,
        hasTwoPointers=1,
        arrayAccesses=4,
        hasLinearStructure=1,
        problemTwoPointer=1,
    ),

    row(
        loopCount=2,
        hasTwoPointers=1,
        arrayAccesses=4,
        problemTwoPointer=1,
    ),

    # Sliding window

    row(
        loopCount=1,
        hasSlidingWindow=1,
        arrayAccesses=3,
        hasLinearStructure=1,
        problemSlidingWindow=1,
    ),

    row(
        loopCount=1,
        hasSlidingWindow=1,
        arrayAccesses=4,
        hasLinearStructure=1,
        problemSlidingWindow=1,
    ),

    row(
        loopCount=2,
        hasSlidingWindow=1,
        arrayAccesses=4,
        problemSlidingWindow=1,
    ),
]


for example in two_pointer_examples:
    X.append(example)
    y.append(6)


# ==========================================================
# CLASS 7
# HEAP OPTIMIZATION
# ==========================================================

heap_examples = [

    row(
        loopCount=2,
        hasHeap=1,
        arrayAccesses=3,
        problemHeap=1,
    ),

    row(
        loopCount=3,
        hasHeap=1,
        arrayAccesses=4,
        problemHeap=1,
    ),

    row(
        loopCount=2,
        hasHeap=0,
        arrayAccesses=4,
        problemHeap=1,
    ),

    row(
        loopCount=3,
        hasHeap=0,
        arrayAccesses=6,
        problemHeap=1,
    ),

    row(
        loopCount=2,
        hasHeap=0,
        nestedLoops=1,
        arrayAccesses=6,
        hasQuadraticSignal=1,
        problemHeap=1,
    ),
]


for example in heap_examples:
    X.append(example)
    y.append(7)


# ==========================================================
# CLASS 8
# GRAPH TRAVERSAL
# ==========================================================

graph_examples = [

    row(
        loopCount=2,
        hasGraphTraversal=1,
        hasBFS=1,
        problemGraph=1,
    ),

    row(
        loopCount=1,
        hasGraphTraversal=1,
        hasDFS=1,
        hasRecursion=1,
        problemGraph=1,
    ),

    row(
        loopCount=3,
        hasGraphTraversal=1,
        hasBFS=1,
        arrayAccesses=4,
        problemGraph=1,
    ),

    row(
        loopCount=2,
        hasGraphTraversal=1,
        hasDFS=1,
        problemGraph=1,
    ),

    row(
        loopCount=3,
        hasGraphTraversal=1,
        hasDFS=1,
        hasRecursion=1,
        problemGraph=1,
    ),
]


for example in graph_examples:
    X.append(example)
    y.append(8)


# ==========================================================
# CLASS 9
# BACKTRACKING / RECURSION
# ==========================================================

backtracking_examples = [

    row(
        loopCount=0,
        hasRecursion=1,
        hasBacktracking=1,
        problemBacktracking=1,
    ),

    row(
        loopCount=1,
        hasRecursion=1,
        hasBacktracking=1,
        problemBacktracking=1,
    ),

    row(
        loopCount=2,
        hasRecursion=1,
        hasBacktracking=1,
        arrayAccesses=3,
        problemBacktracking=1,
    ),

    row(
        loopCount=2,
        hasRecursion=1,
        hasBacktracking=1,
        arrayAccesses=4,
        problemBacktracking=1,
    ),

    row(
        loopCount=3,
        hasRecursion=1,
        hasBacktracking=1,
        arrayAccesses=5,
        problemBacktracking=1,
    ),
]


for example in backtracking_examples:
    X.append(example)
    y.append(9)


# ==========================================================
# VALIDATION
# ==========================================================

print("========================================")
print("TRAINING DATA")
print("========================================")

print("Training samples:", len(X))
print("Feature count:", len(X[0]))
print("Expected features:", len(FEATURE_NAMES))
print("Classes:", sorted(set(y)))


# ==========================================================
# FEATURE COUNT VALIDATION
# ==========================================================

if len(X[0]) != len(FEATURE_NAMES):

    raise ValueError(
        f"Feature count mismatch: "
        f"X has {len(X[0])} features, "
        f"but FEATURE_NAMES has {len(FEATURE_NAMES)}."
    )


# ==========================================================
# VALIDATE EVERY TRAINING ROW
# ==========================================================

for index, example in enumerate(X):

    if len(example) != len(FEATURE_NAMES):

        raise ValueError(
            f"Training row {index + 1} has "
            f"{len(example)} features, "
            f"expected {len(FEATURE_NAMES)}."
        )


# ==========================================================
# VALIDATE X / Y
# ==========================================================

if len(X) != len(y):

    raise ValueError(
        "X/y length mismatch."
    )


# ==========================================================
# VALIDATE CLASS DISTRIBUTION
# ==========================================================

class_counts = {}

for label in y:

    class_counts[label] = (
        class_counts.get(label, 0) + 1
    )


print()
print("========================================")
print("CLASS DISTRIBUTION")
print("========================================")

for label in sorted(class_counts):

    print(
        f"{label}: "
        f"{CLASS_NAMES[label]:<35} "
        f"{class_counts[label]}"
    )


# ==========================================================
# TRAIN / TEST SPLIT
# ==========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y,
)


print()
print("========================================")
print("DATA SPLIT")
print("========================================")

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# ==========================================================
# RANDOM FOREST
# ==========================================================

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=10,
    min_samples_leaf=1,
    random_state=42,
    class_weight="balanced",
)


model.fit(
    X_train,
    y_train,
)


# ==========================================================
# PREDICTIONS
# ==========================================================

predictions = model.predict(
    X_test
)


# ==========================================================
# MODEL EVALUATION
# ==========================================================

accuracy = accuracy_score(
    y_test,
    predictions,
)


print()
print("========================================")
print("MODEL EVALUATION")
print("========================================")

print(
    f"Accuracy: {accuracy:.4f}"
)

print()

print(
    classification_report(
        y_test,
        predictions,
        labels=sorted(CLASS_NAMES.keys()),
        target_names=[
            CLASS_NAMES[i]
            for i in sorted(CLASS_NAMES.keys())
        ],
        zero_division=0,
    )
)


# ==========================================================
# CONFUSION MATRIX
# ==========================================================

matrix = confusion_matrix(
    y_test,
    predictions,
    labels=sorted(CLASS_NAMES.keys()),
)


print()
print("========================================")
print("CONFUSION MATRIX")
print("========================================")

print(
    "Rows    = Actual class"
)

print(
    "Columns = Predicted class"
)

print()

print(
    "      " +
    " ".join(
        f"{i:>4}"
        for i in sorted(CLASS_NAMES.keys())
    )
)

for index, row_values in enumerate(matrix):

    print(
        f"{index:>4}  " +
        " ".join(
            f"{value:>4}"
            for value in row_values
        )
    )


# ==========================================================
# FEATURE IMPORTANCE
# ==========================================================

print()
print("========================================")
print("FEATURE IMPORTANCE")
print("========================================")


feature_importance = sorted(
    zip(
        FEATURE_NAMES,
        model.feature_importances_,
    ),
    key=lambda item: item[1],
    reverse=True,
)


for feature, importance in feature_importance:

    print(
        f"{feature:<35} "
        f"{importance:.4f}"
    )


# ==========================================================
# SAVE MODEL
# ==========================================================

model_path = os.path.join(
    os.path.dirname(__file__),
    "efficiency_model.pkl",
)


with open(
    model_path,
    "wb",
) as file:

    pickle.dump(
        model,
        file,
    )


# ==========================================================
# COMPLETE
# ==========================================================

print()
print("========================================")
print("MODEL TRAINING COMPLETE")
print("========================================")

print(
    "Model:",
    model_path,
)

print(
    "Training samples:",
    len(X),
)

print(
    "Features:",
    len(FEATURE_NAMES),
)

print(
    "Classes:",
    sorted(set(y)),
)

print()
print("Class mapping:")

for label in sorted(CLASS_NAMES):

    print(
        f"{label} = {CLASS_NAMES[label]}"
    )