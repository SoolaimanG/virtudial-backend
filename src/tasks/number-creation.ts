import { usaCallingCode } from "./../data/usaCallingCode";
import { availableNumberTypes } from "./../types";
import { PhoneNumberModel } from "./../models/index";
import { europeCountries } from "./../data/europeCountriesCallingCodes";
import {
  closeConnection,
  createNumber,
  generateRandomNumbers,
  openConnectionPool,
  sendEmail,
} from "./../helpers/index";
import cron from "node-cron";

export class Tasks {
  async newCreationTask() {
    cron.schedule("*/15 * * * * *", async () => {
      try {
        const numberTypes: availableNumberTypes[] = [
          "normal",
          "usa-special-numbers",
        ];
        const type =
          numberTypes[
            generateRandomNumbers(numberTypes.length, false, true) as number
          ];

        const europeCountry = europeCountries.map(
          (country) => country.country.name
        )[
          generateRandomNumbers(
            europeCountries.length - 1,
            false,
            true
          ) as number
        ];

        //

        const usa = usaCallingCode.country.name;

        await openConnectionPool();
        const country = type === "normal" ? europeCountry : usa;
        let newPhoneNumber = await createNumber(type, country);

        const doesNumberExist = await PhoneNumberModel.findOne({
          number: newPhoneNumber.number,
          state: newPhoneNumber.state,
          country: newPhoneNumber.country,
        });

        do {
          newPhoneNumber = await createNumber(type, country);
        } while (doesNumberExist);

        await PhoneNumberModel.create(newPhoneNumber);
        //

        await closeConnection();
      } catch (error) {
        console.log(error);
        await closeConnection();
        // await sendEmail(
        //   "soolaimangee@gmail.com",
        //   String(error),
        //   undefined,
        //   "Error with number creation task, please attend immediately"
        // );
      }
    });
  }
}
