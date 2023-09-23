let db;
const dbName = "myDatabase"; // Change this to your desired database name

const request = indexedDB.open(dbName, 1);
const getDataBtn = document.getElementById("btn");
const updateDataBtn = document.getElementById("btnUpdate");
const deleteDataBtn = document.getElementById("btnDelete");
const addDataBtn = document.getElementById("btnAdd");

request.onerror = function (event) {
  console.error("Error opening the database:", event.target.error);
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("Database opened successfully!");
  // Example usage:
  const newData = { name: "John", age: 30 };
  addData(newData);
};

request.onupgradeneeded = function (event) {
  // This is called when the database version changes or when it's created for the first time.
  db = event.target.result;

  // Create an object store (similar to a table in SQL)
  const objectStore = db.createObjectStore("userStore", {
    keyPath: "id",
  });

  // Define indexes (if needed)
  objectStore.createIndex("userName", "name", { unique: false });
  objectStore.createIndex("user_age_gender", ["age", "gender"], {
    unique: false,
  });

  console.log("Database setup complete!");
};

addDataBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;

  if (!!name && !!age && !!gender) {
    const payload = {
      name,
      age,
      gender,
      id: Math.random(),
    };
    const transaction = db.transaction("userStore", "readwrite");
    const userStore = transaction.objectStore("userStore");
    const request = userStore.add(payload);

    request.onsuccess = function (event) {
      console.log("Data added successfully!");
    };

    request.onerror = function (event) {
      console.error("Error adding data:", event.target.error);
    };
  }
});

getDataBtn.addEventListener("click", async () => {
  const userAgeGenderIndex = "user_age_gender";
  const userNameIndex = "userName";

  const transaction = db.transaction("userStore", "readonly");
  const userStore = transaction.objectStore("userStore");
  const userAgeGenderIndexQuery = userStore.index(userAgeGenderIndex);
  // enter the age & gender for userAgeGenderIndex
  // enter the name for userNameIndex
  const keyRange = IDBKeyRange.only(["10", "f"]);
  const request = userAgeGenderIndexQuery.openCursor(keyRange);

  request.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      console.log("Retrieved data:", cursor.value);
      cursor.continue(); // Move to the next item
    } else {
      console.log("No more data matching the criteria.");
    }
  };

  request.onerror = function (event) {
    console.error("Error fetching data:", event.target.error);
  };
});

deleteDataBtn.addEventListener("click", () => {
  // enter your id
  const id = 0.4148610838841318;
  const transaction = db.transaction("userStore", "readwrite");
  const userStore = transaction.objectStore("userStore");
  const request = userStore.delete(id);

  request.onsuccess = function () {
    console.log("deleted successfully:");
  };

  request.onerror = function (event) {
    console.error("Error deleting data:", event.target.error);
  };
});

updateDataBtn.addEventListener("click", () => {
  const updatedData = {
    id: 0.6769230672315061,
    name: "khan",
    age: 35,
    gender: "m",
  };
  const transaction = db.transaction("userStore", "readwrite");
  const userStore = transaction.objectStore("userStore");

  const request = userStore.put(updatedData);

  request.onsuccess = function (event) {
    console.log("Data updated successfully!");
  };

  request.onerror = function (event) {
    console.error("Error updating data:", event.target.error);
  };
});
