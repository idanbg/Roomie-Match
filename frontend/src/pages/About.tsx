import { motion } from "framer-motion";
import "../styles/About.css";

const About = () => {
  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="about-content">
        <h1 className="about-title">Welcome to Roomie Match</h1>
        <p>
          Roomie Match is the smart, fun, and easy way to find your perfect
          roommate. Our goal is to simplify the process of connecting people
          who share similar lifestyles, interests, and living habits.
        </p>

        <h2 className="about-subtitle">What Can You Do Here?</h2>
        <ul>
          <li>
            <strong>Create Your Personal Profile:</strong> Customize your
            profile, add your bio, upload profile pictures, and share
            information that helps others get to know you.
          </li>
          <li>
            <strong>Discover and Post:</strong> Share your experiences, tips,
            or apartment availabilities. View and interact with other users'
            posts by liking, commenting, and more.
          </li>
          <li>
            <strong>Connect Through Direct Messages:</strong> Engage directly
            with potential roommates through our built-in messaging system.
            Start conversations from user profiles or directly from posts.
          </li>
          <li>
            <strong>AI Roommate Matcher:</strong> Not sure who's right for you?
            Let our advanced AI analyze your bio to suggest the ideal roommate
            for your lifestyle and personality.
          </li>
        </ul>

        <h2 className="about-subtitle">Why Roomie Match?</h2>
        <p>
          Roomie Match brings a fresh, innovative approach to roommate
          matching, ensuring you connect with like-minded individuals who
          complement your daily habits and personal preferences. Whether you're
          a student, young professional, or just someone looking for the right
          person to share your space with, Roomie Match has got you covered.
        </p>

        <h2 className="about-subtitle">Our Commitment</h2>
        <p>
          We value your privacy and security, making sure all your interactions
          within the platform are safe and enjoyable. We're continually
          updating Roomie Match to enhance your user experience and keep you
          connected.
        </p>

        <p className="thanks-text">
          Thanks for being a part of Roomie Match! Let's find your perfect
          roommate match today.
        </p>
      </div>
    </motion.div>
  );
};

export default About;