import path from '../decorators/path';
import Hacker from '../models/Hacker';

export class MainController {

    @path('get', '/')
    static getHome(req, res) {
        res.render("home", {
            title: "Home",
            errors: req.flash('error')
        });
    }

    @path('get', '/offers')
    static async getOffer(req, res) {

        if(!req.query.code) {
            req.flash('error', "You must provide a code.");
            res.redirect('/');
        } else {
            let hacker = await Hacker.findOne({acceptance_code: req.query.code});

            if(!hacker) {
                req.flash('error', "The code you provided is not valid.");
                res.redirect('/');
            } else {

                let page = "offer";
                if(hacker.confirmed) page = "confirmed";
                if(hacker.declined) page = "declined";

                res.render(page, {
                    title: "Offer",
                    hacker,
                    errors: req.flash('error')
                });
            }
        }
    }

    @path('post', '/offers/accept')
    static async acceptOffer(req, res) {
        let hacker = await Hacker.findOne({acceptance_code: req.body.code});
        if(!hacker || hacker.declined) {
            res.send("Offer not found.");
        } else {
            hacker.confirmed = true;
            await hacker.save();
            res.redirect('back');
        }
    }

    @path('post', '/offers/decline')
    static async declineOffer(req, res) {
        let hacker = await Hacker.findOne({acceptance_code: req.body.code});
        if(!hacker || hacker.confirmed) {
            res.send("Offer not found.");
        } else {
            hacker.declined = true;
            await hacker.save();
            res.redirect('back');
        }
    }

}
