from sklearn.ensemble import RandomForestClassifier
import pickle
import os

# Feature order:
# loopCount,
# nestedLoops,
# hasHashMap,
# hasHashSet,
# hasSorting,
# hasBinarySearch,
# arrayAccesses,
# returnVector

X = [
    # -------------------------
    # Efficient examples
    # -------------------------
    [1, 0, 1, 0, 0, 0, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 1, 2, 0],
    [1, 0, 1, 0, 0, 0, 2, 1],
    [1, 0, 0, 0, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0],
    [2, 0, 1, 0, 0, 0, 2, 1],
    [2, 0, 0, 1, 0, 0, 2, 0],
    [2, 0, 0, 0, 1, 0, 2, 0],
    [2, 0, 0, 0, 0, 1, 3, 0],

    # -------------------------
    # Needs optimization
    # -------------------------
    [2, 1, 0, 0, 0, 0, 2, 1],
    [2, 1, 0, 0, 0, 0, 4, 1],
    [2, 1, 0, 0, 1, 0, 3, 0],
    [2, 1, 0, 0, 0, 0, 5, 0],
    [3, 1, 0, 0, 0, 0, 5, 1],
    [3, 1, 0, 0, 0, 0, 6, 1],
    [3, 2, 0, 0, 0, 0, 6, 1],
    [4, 2, 0, 0, 0, 0, 8, 1],
    [2, 1, 0, 0, 0, 0, 6, 0],
    [3, 2, 0, 0, 1, 0, 7, 0],
]

y = [
    # Efficient
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,

    # Needs Optimization
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
]

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=4,
    random_state=42,
)

model.fit(X, y)

model_path = os.path.join(
    os.path.dirname(__file__),
    "efficiency_model.pkl"
)

with open(model_path, "wb") as file:
    pickle.dump(model, file)

print("ML model trained successfully.")
print("Training samples:", len(X))