import { bookingModel } from "@/models/booking-model";
import { hotelModel } from "@/models/hotel-model";
import { ratingModel } from "@/models/rating-model";
import { reviewModel } from "@/models/review-model";
import { userModel } from "@/models/user-model";
import { isDateInBetween, replaceMongoIdInArray, replaceMongoIdInObject } from "@/utils/data-util";

export async function getAllHotels(destination, checkin, checkout, category) {

    const regex = new RegExp(destination, "i")

    const hotelsByDestination = await hotelModel
    .find({city: {$regex: regex}}).select(['thumbNailUrl', 'name', 'highRate', 'lowRate', 'city', 'propertyCategory'])
    .lean();

    let allHotels = hotelsByDestination;

    if(category){
        const categoriesToMatch = category.split('|');

        allHotels = allHotels.filter(hotel => {
            return categoriesToMatch.includes(hotel.propertyCategory.toString())
        })
    }

    if(checkin && checkout) {

        allHotels = await Promise.all(
            allHotels.map( async (hotel) => {
            const found = await findBooking(hotel._id, checkin, checkout);

            if(found){
                hotel["isBooked"] = true;
            } else{
                hotel["isBooked"] = false;
            }

            return hotel;
        })
        )


    }

    return replaceMongoIdInArray(allHotels);
}

async function findBooking(hotelId, checkin, checkout) {
    const matches = await bookingModel.find({hotelId: hotelId.toString()});

    const found = matches.find((match) => {
        return (
            isDateInBetween(checkin, match.checkin, match.checkout) ||
            isDateInBetween(checkout, match.checkin, match.checkout)
        )
    });

    return found;
}

export async function getHotelById(hotelId, checkin, checkout) {
    const hotel = await hotelModel.findById(hotelId).lean();

    if(checkin && checkout){
        const found = await findBooking(hotel._id, checkin, checkout);

        if(found){
            hotel["isBooked"] = true;
        } else{
             hotel["isBooked"] = false;
        }
    }
    return replaceMongoIdInObject(hotel);
}

export async function getRatingsForAHotel(hotelId) {
    const rating = await ratingModel.find({hotelId: hotelId}).lean();

    return replaceMongoIdInArray(rating);
    
}

export async function getReviewsForAHotel(hotelId) {
    const reviews = await reviewModel.find({hotelId: hotelId}).lean();

    return replaceMongoIdInArray(reviews);
    
}

export async function getUserByEmail(email) {
    const users = await userModel.find({email: email}).lean();

    return replaceMongoIdInObject(users[0]);
    
}


export async function getBookingsByUser(userId) {
    const bookings = await bookingModel.find({userId: userId}).lean();

    return replaceMongoIdInArray(bookings);
}