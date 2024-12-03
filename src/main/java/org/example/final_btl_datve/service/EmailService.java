package org.example.final_btl_datve.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String subject, String text) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("tieuphuchac1103@gmail.com"); // Gửi từ email tổng
            helper.setTo(to); // Gửi đến email người nhận
            helper.setSubject(subject);
            helper.setText(text, true); // `true` cho phép định dạng HTML trong email

            mailSender.send(message);
            System.out.println("Email sent successfully!");

        } catch (MessagingException e) {
            System.out.println("Failed to send email: " + e.getMessage());
        }
    }

    @Async
    public void sendEmail(String recipientEmail, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("tieuphuchac1103@gmail.com"); // Gửi từ email tổng
            helper.setTo(recipientEmail); // Gửi đến email người nhận
            helper.setSubject(subject);
            helper.setText(body, true); // `true` cho phép định dạng HTML trong email

            mailSender.send(message);
            System.out.println("Email sent successfully!");

        } catch (MessagingException e) {
            System.out.println("Failed to send email: " + e.getMessage());
        }
    }
}
