import mysql from "mysql2/promise";

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "YourNewPassword",
      database: "reply_platform",
    });

    const [rows] = await connection.query(
      "SELECT 1"
    );

    console.log("MYSQL CONNECTION SUCCESS:", rows);

    await connection.end();

  } catch (error) {
    console.error("MYSQL CONNECTION FAILED:", error);
  }
}

test();