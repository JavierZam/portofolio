<?php
class Email_Form {
    private $to;
    private $from;
    private $subject;
    private $message;

    public function __construct($to, $from, $subject, $message) {
        $this->to = $to;
        $this->from = $from;
        $this->subject = $subject;
        $this->message = $message;
    }

    public function send() {
        $headers = 'From: ' . $this->from . "\r\n" .
            'Reply-To: ' . $this->from . "\r\n" .
            'X-Mailer: PHP/' . phpversion();

        return mail($this->to, $this->subject, $this->message, $headers);
    }
}
?>
