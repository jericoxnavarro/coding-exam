import chalk from "chalk";
import { ParkingSlots } from "../constants/index.js";

export class Parking {
  constructor() {
    this.PARK = ParkingSlots;
  }

  map() {
    console.log(`\n${chalk.greenBright.bold("PARKING COMPLEX:")}`);
    this.PARK.map((entry) => {
      console.log(`${chalk.bold(`Entry ${entry.name}`)}`);
      entry.slots.map((slot) => {
        console.log(chalk.bold("---------------------"));
        console.log(`Slot Number: ${chalk.bold(`${slot.name}`)}`);
        console.log(
          `Availability: ${
            slot.occupied
              ? `${chalk.redBright.bold(`FALSE`)}`
              : `${chalk.greenBright.bold(`TRUE`)}`
          }`
        );
        console.log(`Parking Size: ${chalk.bold(`${slot.parkingSize.slot}`)}`);
        if (slot.parkDate) {
          console.log(`Park Date: ${chalk.bold(`${slot.parkDate}`)}`);
        }
      });
      console.log(`\n`);
    });
  }

  park(size, entry) {
    const entryData = this.PARK.find((entryPoint) => {
      return entryPoint.name === entry.toUpperCase();
    });

    if (entryData) {
      // Check if vehicle fits in parking slot
      const findFitSlot = entryData.slots.filter(
        (data) => data.parkingSize.size >= size
      );
      if (findFitSlot) {
        let slot;
        // Search for the available and nearest parking space
        for (let i = 0; i < findFitSlot.length; i++) {
          if (slot) {
            if ((slot.row > findFitSlot[i].row) & !findFitSlot[i].occupied) {
              slot = findFitSlot[i];
            }
          } else if (!findFitSlot[i].occupied) {
            slot = findFitSlot[i];
          }
        }

        // Park the vehicle
        if (slot) {
          const entryIndex = this.PARK.findIndex(
            (entryPoint) => entryPoint.name === entry.toUpperCase()
          );
          const slotIndex = entryData.slots.findIndex(
            (slotData) => slotData.name === slot.name
          );

          Object.assign(this.PARK[entryIndex].slots[slotIndex], {
            name: slot.name,
            occupied: true,
            parkingSize: slot.parkingSize,
            column: slot.column,
            row: slot.row,
            parkDate: new Date(),
          });

          console.log(
            `You have been assigned to park at ${chalk.yellowBright.bold(
              slot.name
            )}\n`
          );
        } else {
          console.log(chalk.yellowBright.bold("No parking slot available.\n"));
        }
      } else {
        console.log(
          chalk.yellowBright.bold("No parking slot fit in your vehicle size.\n")
        );
      }
    } else {
      console.log(chalk.redBright.bold("Invalid Input. Please try again.\n"));
    }
  }

  unpark(slotName) {
    const entryIndex = this.PARK.findIndex(
      (entryPoint) => entryPoint.name === slotName.charAt(0)
    );

    if (this.PARK[entryIndex]) {
      const slotIndex = this.PARK[entryIndex].slots.findIndex(
        (slotData) => slotData.name === slotName
      );
      let parkDetails = this.PARK[entryIndex].slots[slotIndex];
      let diff = new Date() - parkDetails.parkDate;

      let totalPayable = this.compute(parkDetails.parkingSize.size, diff);

      console.log(
        `Total charges: ${chalk.yellowBright.bold(`PHP ${totalPayable}`)}\n`
      );
      // Reset parking slot
      Object.assign(this.PARK[entryIndex].slots[slotIndex], {
        name: parkDetails.name,
        occupied: false,
        parkingSize: parkDetails.parkingSize,
        column: parkDetails.column,
        row: parkDetails.row,
        parkDate: null,
      });
    } else {
      console.log(chalk.redBright.bold("Invalid Input. Please try again.\n"));
    }
  }

  // Compute total charges based on parking size and total time parked
  compute(size, totalTime) {
    let remainingTime = totalTime;
    let t24 = 1000 * 60 * 24;
    let t1h = 1000 * 60;
    let charges = 0;

    var hourlyCharge = 0;

    if (size == 0) {
      hourlyCharge = 20;
    } else if (size == 1) {
      hourlyCharge = 60;
    } else if (size == 2) {
      hourlyCharge = 100;
    }

    // For parking that exceeds 24 hours, every full 24 hour chunk is charged 5,000 pesos regardless of parking slot.
    if (remainingTime > t24) {
      let n24 = parseInt(totalTime / t24);
      charges += n24 * 5000;
      remainingTime -= n24 * t24;
    }

    // First 3 hours has a flat rate of 40
    if (remainingTime > t1h * 3) {
      remainingTime -= t1h * 3;
      charges += 40;
    }

    // The exceeding hourly rate beyond the initial three (3) hours will be charged as follows:
    // - 20/hour for vehicles parked in SP;
    // - 60/hour for vehicles parked in MP; and
    // - 100/hour for vehicles parked in LP
    if (remainingTime > 0) {
      let remainingHours = Math.ceil(remainingTime / t1h);
      charges += remainingHours * hourlyCharge;
    }

    // return total charges
    return charges;
  }
}
