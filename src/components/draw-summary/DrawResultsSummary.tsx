import React from "react";

const DrawResultsSummaryPage = (data: { firstDraw: string[], secondDraw: string[], thirdDraw: string[] }) => {
    const hotNumbers = [40];

    console.log(data)

    return (
        <React.Fragment>
            <div className="flex gap-2">
                <div>
                    <p className="text-sm font-light mb-1">
                        First Draw
                    </p>
                    <div className="flex gap-2">
                        {data.firstDraw.map((number, index) => (
                            <div
                                key={index}
                                className="w-fit bg-transparent border border-[#0038A8] rounded-sm px-10 py-8 flex items-center justify-center"
                            >
                                <p className="font-bold text-3xl lg:text-5xl">{number}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col ml-4">
                    <p className="text-sm font-light mb-1">
                        Second Draw
                    </p>
                    <div className="flex gap-2">
                        {data.secondDraw.map((number, index) => (
                            <div
                                key={index}
                                className="w-fit bg-transparent border border-[#0038A8] rounded-sm px-10 py-8 flex items-center justify-center"
                            >
                                <p className="font-bold text-3xl lg:text-5xl">{number}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col ml-4">
                    <p className="text-sm font-light mb-1">
                        Third Draw
                    </p>
                    <div className="flex gap-2">
                        {data.thirdDraw.map((number, index) => (
                            <div
                                key={index}
                                className="w-fit bg-transparent border border-[#0038A8] rounded-sm px-10 py-8 flex items-center justify-center"
                            >
                                <p className="font-bold text-3xl lg:text-5xl">{number}</p>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </React.Fragment>
    );
};

export default DrawResultsSummaryPage;
