const FavouriteModel = require('../models/favouriteModel');

class FavouriteController {
    async getUserFavourites(req) {
        try {
            // const {userId} = req.body;
            if(req.session && req.session.user_token){
                const userId = req.session.user_token;
                let favourites;
                favourites = await FavouriteModel.find({userId: userId}).populate('productId');
                return favourites;
            }
            else {
                return null;
            }
        } catch(e) {
            console.log(e);
            return { message: 'Connot get favourites' };
        }
    }

    async getAllFavourites() {
        try {
            let favourites = [];
            favourites.push(...(await FavouriteModel.find()));
            return favourites
        } catch(e) {
            console.log(e);
            return { message: 'Connot get favourites' };
        }
    }

    async getOneFavourite(req) {
        try {
            const {productId} = req.query;
            if (req.session && req.session.user_token) {
                const userId = req.session.user_token;
                let favourite =
                favourites(await FavouriteModel.findOne({userId: userId, productId: productId})).populate('productId');
                return favourite;
            }
            else {
                return null;
            }
        } catch(e) {
            console.log(e);
            return { message: 'Connot get favourites' };
        }
    }

    async createDeleteFavourite(req, res){
        try {
            if (req.session && req.session.user_token) {
                const userId = req.session.user_token;
                const {productId } = req.body;
                let result = await FavouriteModel.deleteOne({ userId: userId, productId: productId });
                if(result.deletedCount==0)
                    result = await FavouriteModel.create({ userId: userId, productId: productId });
                return res.redirect('/favourites');
            }
            return res.redirect('/login');
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot delete favourite' });
        }
    }

    async createFavourite(req){
        try {
            const {userId, productId} = req.body;
            const result = await FavouriteModel.create({userId: userId, productId: productId});
            return res.json(result);
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot create favourite' });
        }
    }
}

module.exports = new FavouriteController()