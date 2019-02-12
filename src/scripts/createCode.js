import './setup';
import {_hackers2} from "./_hackers2";
import Hacker     from "../models/Hacker";
import uuidv4     from 'uuid/v4';

(async () => {
    for (let email of _hackers2) {
        let hacker = await Hacker.findOne({email_address: email});
        if(hacker && !hacker.acceptance_code) {
            hacker.acceptance_code = uuidv4();
            await hacker.save();
            console.log(hacker.acceptance_code);
        }
    }
})();
