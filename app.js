import readline from "readline";
import chalk from "chalk";
import { Parking } from "./model/Parking.js";
import { Header } from "./constants/index.js";

let parking = new Parking();
let prompt = `${chalk.greenBright(
  "[ P - PARK, U - UNPARK, M - MAP, X -EXIT ]"
)}\n${chalk.blueBright.bold("SELECT ACTION: ")}`;
console.clear();
console.log(chalk.blueBright.bold(Header));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt,
});

rl.prompt();

rl.on("line", async (line) => {
  switch (line.trim().toLowerCase()) {
    case "x":
      rl.close();
      break;
    case "p":
      rl.question(
        `${chalk.greenBright("[ 0-S, 1-M, 2-L ]")}\n${chalk.blueBright.bold(
          "Enter your vehicle size: "
        )}`,
        (vehicleSize) => {
          let entryNames = parking.PARK.map((entryPoints) => entryPoints.name);
          rl.question(
            `${chalk.greenBright(`[ ${entryNames} ]`)}\n${chalk.blueBright.bold(
              "Choose the entry point: "
            )}`,
            (entryPoint) => {
              parking.park(parseInt(vehicleSize), entryPoint);
              rl.prompt();
            }
          );
        }
      );
      break;
    case "u":
      rl.question(
        `${chalk.blueBright.bold("Enter your slot number: ")}`,
        (slotNumber) => {
          parking.unpark(slotNumber);
        }
      );
      break;
    case "m":
      parking.map();
      break;
    default:
      break;
  }
  rl.prompt();
}).on("close", () => {
  console.log(`${chalk.yellowBright.bold("Thank you! Have a Great Day!")}`);
  process.exit(0);
});

rl.on("close", function () {
  console.log(
    `${chalk.yellowBright.bold("\nThank you! We are pleased to serve you.")}`
  );
  process.exit(0);
});
