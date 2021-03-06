﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using System.Text;
using System.Net.Mail;

namespace keelsen.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index(Mail Data)
        {
            if (ModelState.IsValid)
            {
                StringBuilder message = new StringBuilder();
                MailAddress from = new MailAddress(Data.Email);
                message.Append("Name: " + Data.Name + "\n");
                message.Append("Email: " + Data.Email + "\n");
                message.Append("Subject: " + Data.Subject + "\n");
                message.Append("Subject: \n" + Data.Message);

                MailMessage mail = new MailMessage();

                SmtpClient smtp = new SmtpClient();

                smtp.Host = "smtp.gmail.com";
                smtp.Port = 587;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.UseDefaultCredentials = false;

                smtp.Credentials = new System.Net.NetworkCredential("company@keelsen.com", "K33ls3n2188#");
                smtp.EnableSsl = true;

                mail.From = from;
                mail.To.Add("company@keelsen.com");
                mail.Subject = "Keelsen Contact Form: " + Data.Subject + " (" + Data.Email + ")";
                mail.Body = message.ToString();

                smtp.Send(mail);
                Data.Done = true;
            }
            return View(Data);

        }


        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
