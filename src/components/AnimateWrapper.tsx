import { CARD_VARIANTS } from "@/utilities";
import { motion } from "motion/react"

const AnimateWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            variants={CARD_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: "100%" }}
        >
            {children}
        </motion.div>
    )
}

export default AnimateWrapper;