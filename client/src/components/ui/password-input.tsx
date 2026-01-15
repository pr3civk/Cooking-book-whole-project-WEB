import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

const PasswordInput = ({
	className,
	...props
}: React.ComponentProps<typeof Input>) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div className="relative">
			<Input
				className={className}
				type={isVisible ? "text" : "password"}
				name="password"
				{...props}
			/>
			<Button
				variant="ghost"
				size="icon"
				className="absolute top-1/2 right-0.5 text-2xl text-gray-500 cursor-pointer -translate-y-1/2"
				onClick={(e) => {
					e.preventDefault();
					setIsVisible((prev) => !prev);
				}}
			>
				{isVisible ? <Eye size={22} /> : <EyeOff size={22} />}
			</Button>
		</div>
	);
};

export { PasswordInput };
export default PasswordInput;
