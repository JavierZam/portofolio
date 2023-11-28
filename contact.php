<?php
include_once('assets/vendor/php-email-form/php-email-form.php');

if ($_POST) {
   $name = $_POST['name'];
   $email = $_POST['email'];
   $subject = $_POST['subject'];
   $message = $_POST['message'];

   $toEmail = 'javier_zam@yahoo.co.id';
   $emailSubject = 'Pesan Baru Dari: ' . $name;
   $headers = ['From' => $email, 'Reply-To' => $email, 'Content-type' => 'text/html; charset=iso-8859-1'];

   $bodyParagraphs = ["Nama: {$name}", "Email: {$email}", "Pesan:", $message];
   $body = join(PHP_EOL, $bodyParagraphs);

   $emailForm = new Email_Form($toEmail, $email, $emailSubject, $body);

   if ($emailForm->send()) {
      echo 'Pesan mu telah terkirim, Terima Kasih!';
   } else {
      echo 'Ada masalah saat mengirim email. Silakan coba lagi nanti.';
   }
}
?>