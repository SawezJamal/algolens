import sys
import json
import pickle
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "efficiency_model.pkl"
)

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

features = json.load(sys.stdin)

feature_vector = [[
    features["loopCount"],
    features["nestedLoops"],
    features["hasHashMap"],
    features["hasHashSet"],
    features["hasSorting"],
    features["hasBinarySearch"],
    features["arrayAccesses"],
    features["returnVector"],
]]

prediction = model.predict(feature_vector)[0]

probabilities = model.predict_proba(feature_vector)[0]

confidence = round(
    float(max(probabilities)) * 100,
    2
)

result = {
    "prediction": (
        "Needs Optimization"
        if prediction == 1
        else "Efficient"
    ),
    "confidence": confidence,
}

print(json.dumps(result))