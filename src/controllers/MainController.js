import path                     from '../decorators/path';
import Hacker                   from '../models/Hacker';
import {request, GraphQLClient} from 'graphql-request';

export class MainController {

    @path('get', '/')
    static getHome(req, res) {
        res.render("home", {
            title: "Home",
            errors: req.flash('error'),
            successes: req.flash('success')
        });
    }

    @path('post', '/login')
    static async login(req, res) {
        let result;
        try {
            result = await request(process.env.GRAPHQL_ENDPOINT, `
                mutation ($email_address: String!, $password: String!) {
                    createHackerToken(email_address: $email_address, password: $password) {
                        token_body
                    }
                }
            `, {
                    email_address: req.body.email,
                    password: req.body.password
                });
        } catch (e) {
            req.flash('error', 'Invalid credentials, please check your email address and password.');
            res.redirect('back');
            return;
        }
        // Start authenticated requests.
        const {createHackerToken: {token_body}} = result;
        const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT, { headers: {authorization: `Bearer ${token_body}`} });
        const {me: {email_address}} = await client.request(`
            {me {email_address}}
        `);

        // Find the hacker
        let hacker = await Hacker.findOne({email_address});
        if(!hacker) {
            req.flash('error', 'Unknown fatal error.');
            res.redirect('back');
            return;
        }

        if(!hacker.acceptance_code) {
            req.flash('error', "😢 Unfortunately we can't find any invitations for your account.");
            res.redirect('back');
            return;
        } else {
            res.redirect(`/offers?code=${hacker.acceptance_code}`);
        }

        console.log(result);
    }

    @path('get', '/forgot')
    static async getForgotPasswordPage(req, res) {
        res.render("forgot", {
            title: "Forgot Password",
            errors: req.flash('error'),
            successes: req.flash('success')
        });
    }

    @path('post', '/forgot')
    static async sendPasswordResetEmail(req, res) {
        let hacker = await Hacker.findOne({email_address: req.body.email});
        if(!hacker) {
            req.flash('error', "There is no hacker account associated with this email address.");
            res.redirect('back');
        } else {
            try {
                await request(process.env.GRAPHQL_ENDPOINT, `
                    mutation ($email_address: String!) {
                        sendHackerPasswordResetEmail(email_address: $email_address)
                    }
                `, {
                    email_address: req.body.email
                })
            } catch (e) {
                req.flash('error', "Unknown error.");
                res.redirect('back');
                return;
            }
            res.redirect(`/reset?email=${req.body.email}`);
        }
    }

    @path('get', '/reset')
    static async getPasswordResetPage(req, res) {
        res.render("reset", {
            title: "Reset Password",
            errors: req.flash('error'),
            email: req.query.email,
            successes: req.flash('success')
        });
    }

    @path('post', '/reset')
    static async resetPassword(req, res) {
        try {
            await request(process.env.GRAPHQL_ENDPOINT, `
                mutation ($email_address: String!, $code: String!, $password: String!) {
                    resetHackerPassword (email_address: $email_address, code: $code, new_password: $password) {
                        _id
                    }
                }
            `, {
                email_address: req.body.email,
                code: req.body.code,
                password: req.body.password
            })
        } catch (e) {
            req.flash('error', "Invalid password reset code or invalid password.");
            res.redirect('back');
            return;
        }
        req.flash('success', "Password reset successful.");
        res.redirect('/');
    }

    @path('get', '/offers')
    static async getOffer(req, res) {

        if (!req.query.code) {
            req.flash('error', "You must provide a code.");
            res.redirect('/');
        } else {
            let hacker = await Hacker.findOne({acceptance_code: req.query.code});

            if (!hacker) {
                req.flash('error', "The code you provided is not valid.");
                res.redirect('/');
            } else {

                let page = "offer";
                if (hacker.confirmed) page = "confirmed";
                if (hacker.declined) page = "declined";

                res.render(page, {
                    title: "Offer",
                    hacker,
                    errors: req.flash('error'),
                    successes: req.flash('success')
                });
            }
        }
    }

    @path('post', '/offers/accept')
    static async acceptOffer(req, res) {
        let hacker = await Hacker.findOne({acceptance_code: req.body.code});
        if (!hacker || hacker.declined) {
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
        if (!hacker || hacker.confirmed) {
            res.send("Offer not found.");
        } else {
            hacker.declined = true;
            await hacker.save();
            res.redirect('back');
        }
    }

}
