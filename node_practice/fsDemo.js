import fs from "fs/promises";

async function fileDemo() {
  try {
    // Read file
    const data = await fs.readFile("sample.txt", "utf8");
    console.log("data:", data);

    // Write file (overwrite or create)
    await fs.writeFile("output.txt", "Hello World");
    console.log("File created successfully");

    // Append file
    await fs.appendFile("output.txt", "\nThis line is appended");
    console.log("Content appended successfully");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fileDemo();
