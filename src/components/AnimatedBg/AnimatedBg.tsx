const colors = ["bg-red-500", "bg-blue-500", "bg-orange-400"];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-whit">
      <div className="absolute flex justify-center items-center  w-full h-full">
       
        {/* {[...Array(20)].map((_, i) => {
          const colorClass = colors[Math.floor(Math.random() * colors.length)];
          return (
            <span
              key={i}
              className={`absolute  rounded-full ${colorClass} opacity-[0.1] blur-md animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                 width: `${50 + Math.random() * 60}px`,
                height: `${50 + Math.random() * 60}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 1}s`,
              }}
            />
          );
        })} */}
      </div>
    </div>
  );
}

