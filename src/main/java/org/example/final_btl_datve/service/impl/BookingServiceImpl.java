package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.BookingRequest;
import org.example.final_btl_datve.dto.BookingResponse;
import org.example.final_btl_datve.entity.*;
import org.example.final_btl_datve.entity.enumModel.BookingStatus;
import org.example.final_btl_datve.entity.enumModel.PromotionType;
import org.example.final_btl_datve.entity.enumModel.SeatStatus;
import org.example.final_btl_datve.entity.key.BookingComboKey;
import org.example.final_btl_datve.entity.key.BookingSeatKey;
import org.example.final_btl_datve.repository.*;
import org.example.final_btl_datve.service.BookingService;
import org.example.final_btl_datve.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final ComboRepository comboRepository;
    private final PromotionRepository promotionRepository;
    private final EmailService emailService;
    private final BookingSeatRepository bookingSeatRepository;

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository, ShowtimeRepository showtimeRepository, SeatRepository seatRepository, ComboRepository comboRepository, PromotionRepository promotionRepository, EmailService emailService, BookingSeatRepository bookingSeatRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.comboRepository = comboRepository;
        this.promotionRepository = promotionRepository;
        this.emailService = emailService;
        this.bookingSeatRepository = bookingSeatRepository;
    }

    private Booking createBookingFromRequest(BookingRequest bookingRequest) {
        Booking booking = new Booking();
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus(BookingStatus.Pending);

        double totalPrice = 0.0;

        // Fetch
        User user = userRepository.findById(bookingRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        booking.setUser(user);

        // Fetch showtime
        Showtime showtime = showtimeRepository.findById(bookingRequest.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        booking.setShowtime(showtime);

        // Set booking_seats
        List<Booking_Seat> booking_seats = bookingRequest.getSeatIds().stream()
                .map(seatId -> {
                    // Fetch seat
                    Seat seat = seatRepository.findById(seatId)
                            .orElseThrow(() -> new RuntimeException("Seat not found"));
                    // Check if the seat is already booked
                    boolean isSeatBooked = seat.getBookingSeats().stream()
                            .anyMatch(booking_seat -> booking_seat.getBooking().getShowtime().getShowtimeId().equals(bookingRequest.getShowtimeId()));

                    Booking_Seat booking_seat = new Booking_Seat();
                    BookingSeatKey bookingSeatKey = new BookingSeatKey(booking.getBookingId(), seatId);
                    booking_seat.setId(bookingSeatKey);
                    booking_seat.setBooking(booking);
                    booking_seat.setStatus(SeatStatus.Booked);

                    booking_seat.setSeat(seat);
                    return booking_seat;
                })
                .collect(Collectors.toList());
        booking.setBooking_seats(booking_seats);

        // Set booking_combos
        List<Booking_Combo> booking_combos = bookingRequest.getComboIds().stream()
                .map(comboId -> {
                    Combo combo = comboRepository.findById(comboId)
                            .orElseThrow(() -> new RuntimeException("Combo not found"));
                    BookingComboKey bookingComboKey = new BookingComboKey(booking.getBookingId(), comboId);
                    return new Booking_Combo(bookingComboKey, booking, combo);
                })
                .collect(Collectors.toList());
        booking.setBooking_combos(booking_combos);

        // Calulate total price
        totalPrice += booking_seats.stream()
                .mapToDouble((seat -> seat.getSeat().getSeatType().getSeatPrice()))
                .sum();
        totalPrice += booking_combos.stream()
                .mapToDouble((combo -> combo.getCombo().getPrice()))
                .sum();

        // Apply movies promotions
        List<Promotion> promotionMovie = promotionRepository.findPromotionsByKeyword(showtime.getMovie().getMovieName());
        for(Promotion p : promotionMovie){
            if(p.getPromotionType() == PromotionType.MOVIE &&
                    p.getPromotionStartDate().isBefore(showtime.getStartTime()) &&
                    p.getPromotionEndDate().isAfter(showtime.getStartTime())){
                totalPrice -= p.getPrice();
            }
        }

        // Apply first week registration discount
        if(user.getCreatAt().plusWeeks(1).isAfter(LocalDateTime.now())){
            totalPrice -= 30000;
        }

        // Apply cinema promotions
        List<Promotion> promotions = promotionRepository.findPromotionsByKeyword(showtime.getRoom().getCinema().getCinemaName());
        for(Promotion p : promotions){
            if(p.getPromotionType() == PromotionType.CINEMA){
                totalPrice += p.getPrice() * booking_seats.size();
            }
        }

        // Apply points usage
        double pointsUsed = bookingRequest.getPointUse() == null ? 0.0 : bookingRequest.getPointUse();
        if(pointsUsed > user.getAccumulatedPoints()){
            throw new RuntimeException("Not enough points to use");
        }
        totalPrice -= pointsUsed;
        user.setAccumulatedPoints(user.getAccumulatedPoints() - pointsUsed);

        booking.setTotalPrice(totalPrice);

        //Calculate and set points earned
        booking.calculatePoints();
        user.setAccumulatedPoints(user.getAccumulatedPoints() + booking.getPointsEarned());

        userRepository.save(user);
        return booking;
    }

//    private void applyPromotion(Booking booking) {
//        // Check if the user is within one week of registration
//        LocalDateTime oneWeekAfterRegistration = booking.getUser().getCreatAt().plusWeeks(1);
//        boolean isWithinOneWeek = LocalDateTime.now().isBefore(oneWeekAfterRegistration);
//
//        if (isWithinOneWeek) {
//            booking.setTotalPrice(booking.getTotalPrice() - 30000);
//        }
//
//        // Check if there is a promotion for the movie
//        Movie movie = booking.getShowtime().getMovie();
//        List<Promotion> promotionMovie = promotionRepository.findAll();
//
//        for(Promotion p: promotionMovie){
//            if(p.getPromotionType().equals(PromotionType.MOVIE)){
//                if(p.getPromotionStartDate().isBefore(booking.getShowtime().getStartTime()) && p.getPromotionEndDate().isAfter(booking.getShowtime().getStartTime())){
//                    List<Promotion> promotion = promotionRepository.findPromotionsByKeyword(movie.getMovieName());
//                    if(!promotion.isEmpty()){
//                        List<Combo> combos = comboRepository.findAll();
//                        for(Combo c : combos){
//                            List<Promotion> test = promotionRepository.findPromotionsByKeyword(c.getComboName());
//                            if(!test.isEmpty()){
//                                c.setPrice(0.0);
//                                booking.getBooking_combos().add(new Booking_Combo(new BookingComboKey(booking.getBookingId(), c.getComboId()), booking, c));
//                            }
//                        }
//                    }
//                }
//            }
//        }
//
//        // Check if there is a promotion for the cinema
//        List<Promotion> promotions = promotionRepository.findAll();
//        if(promotions.isEmpty()){
//            booking.setTotalPrice(booking.getBooking_seats().stream()
//                    .map(booking_seat -> booking_seat.getSeat().getSeatType().getSeatPrice())
//                    .reduce(0.0, Double::sum));
//        }else {
//            for (Promotion p : promotions) {
//                if (p.getPromotionType().equals(PromotionType.CINEMA)) {
//                    if (!promotionRepository.findPromotionsByKeyword(booking.getShowtime().getRoom().getCinema().getCinemaName()).isEmpty()) {
//                        booking.setTotalPrice(booking.getTotalPrice() + p.getPrice() * booking.getBooking_seats().size());
//                    } else {
//                        booking.setTotalPrice(booking.getBooking_seats().stream()
//                                .map(booking_seat -> booking_seat.getSeat().get
//    private Booking saveBooking(Booking booking) {
//        return bookingRepository.save(booking);
//    }
//                    }
//                }
//            }
//        }
//    }

    private BookingResponse createResponseFromBooking(Booking booking) {
        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .userId(booking.getUser().getUserId())
                .showtimeId(booking.getShowtime().getShowtimeId())
                .totalPrice(booking.getTotalPrice())
                .pointsEarned(booking.getPointsEarned())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus().name())
                .seatIds(booking.getBooking_seats().stream()
                        .map(booking_seat -> booking_seat.getSeat().getSeatId())
                        .collect(Collectors.toList()))
                .comboIds(booking.getBooking_combos().stream()
                        .map(booking_combo -> booking_combo.getCombo().getComboId())
                        .collect(Collectors.toList()))
                .message("Vui lòng đợi xác nhận từ quản lý")
                .build();
    }

    private void sendBookingConfirmation(User user, Booking booking) {
        String recipientEmail = user.getEmail();
        String subject = "Your E-Ticket Confirmation";
        String body = generateTicketDetails(booking);

        emailService.sendEmail( recipientEmail, subject, body);
    }

    private String generateTicketDetails(Booking booking) {
        // Create HTML content with a table format
        return "<html>" +
                "<body>" +
                "<h2>Booking Details</h2>" +
                "<table border='1' style='border-collapse: collapse; width: 100%;'>" +
                "  <tr><th>Category</th><th>Details</th></tr>" +
                "  <tr><td>Movie</td><td>" + booking.getShowtime().getMovie().getMovieName() + "</td></tr>" +
                "  <tr><td>Cinema</td><td>" + booking.getShowtime().getRoom().getCinema().getCinemaName() + "</td></tr>" +
                "  <tr><td>Date</td><td>" + booking.getShowtime().getStartTime() + "</td></tr>" +
                "  <tr><td>Price</td><td>" + booking.getTotalPrice() + "</td></tr>" +
                "  <tr><td>Combo</td><td>" + booking.getBooking_combos().stream()
                .map(combo -> combo.getCombo().getComboName())
                .collect(Collectors.joining(", ")) + "</td></tr>" +
                "  <tr><td>Seats</td><td>" + booking.getBooking_seats().stream()
                .map(seat -> seat.getSeat().getSeatRow() + seat.getSeat().getSeatNumber())
                .collect(Collectors.joining(", ")) + "</td></tr>" +
                "</table>" +
                "<p>Thank you for choosing our service!</p>" +
                "</body></html>";
    }

    @Override
    public BookingResponse bookTicket(BookingRequest bookingRequest){
        Booking booking = createBookingFromRequest(bookingRequest);
        bookingRepository.save(booking);
        return createResponseFromBooking(booking);
    }

    @Override
    public void approveBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if(booking.getStatus() != BookingStatus.Pending){
            throw new RuntimeException("Booking is not pending");
        }

        // Duyệt booking
        booking.setStatus(BookingStatus.Approved);
        sendBookingConfirmation(booking.getUser(), booking);
        bookingRepository.save(booking);

        // Cập nhật trạng thái ghế
        for(Booking_Seat booking_seat : booking.getBooking_seats()){
            booking_seat.setStatus(SeatStatus.Booked);
            bookingSeatRepository.save(booking_seat);
        }
    }


    @Override
    public List<Booking> getPendingTickets() {
        return bookingRepository.findByStatus(BookingStatus.Pending);
    }

    @Override
    public BookingStatus getBookingStatus(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return booking.getStatus();
    }

    @Override
    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        bookingRepository.delete(booking);
    }
}
