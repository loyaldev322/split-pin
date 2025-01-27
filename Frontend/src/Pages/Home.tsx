import { ExternalLinkIcon, PlusCircleIcon } from "@heroicons/react/outline";
import Button from "components/Button";
import { ReactComponent as Group } from "../images/group.svg";
import { ReactComponent as MoneyBag } from "../images/MoneyBag.svg";
import { Link } from "react-router-dom";
import { useContext } from "react";
import GroupContext from "contexts/GroupContext";
import { Loading } from "components";
import { BarChart, PieChart } from "components/Graph";
import { UserIcon } from "@heroicons/react/solid";
import StatisticsCard from "components/cards/statistics-card";
import {
	Typography,
	Card,
	CardHeader,
	CardBody,
	IconButton,
	Menu,
	MenuHandler,
	MenuList,
	MenuItem,
	Avatar,
	Tooltip,
	Progress,
} from "@material-tailwind/react";
import React from "react";
const Home = () => {
	const { groupList } = useContext(GroupContext);

	return (
		<div className="my-10 pb-10 bg-gray-100 flex-1 px-4 sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl">
			{/* Group Overview */}
			<div className="my-12">
				<CardHeader
					variant="gradient"
					color="blue"
					className={`flex border-b p-6 mb-10 ${
						groupList.length > 3
							? "justify-between"
							: "justify-center"
					} `}>
					<h1 className="text-2xl font-bold text-center">
						Your Groups
					</h1>
					{groupList.length > 3 && (
						<Link to="/groups">
							<Button type="danger">View All </Button>
						</Link>
					)}
				</CardHeader>
				{groupList ? (
					<div className="mt-6 grid w-full space-y-3 sm:place-content-center sm:place-items-center sm:space-y-0 md:grid-cols-2 lg:grid-cols-3">
						{groupList.slice(0, 3).map((group) => (
							<div
								key={group._id}
								className="flex h-56 w-3/4 min-w-full flex-col justify-between rounded-xl border-2 shadow-sm sm:min-w-0">
								<StatisticsCard
									key={group._id}
									color={"pink"}
									value={group.name}
									title={group.description}
									icon={React.createElement(UserIcon, {
										className: "w-6 h-6 text-white",
									})}
									footer={
										<Typography className="font-normal flex flex-col text-blue-gray-600">
											<strong
												className={"text-green-500"}>
												{" "}
												Total Expenses :
												{group.totalExpenses}
											</strong>
											<strong>
												Members :{group.members.length}
											</strong>
											<div className="flex justify-end  p-2">
												<Link
													to={`/group/detail/${group._id}`}>
													<Button type="danger">
														Open
													</Button>
												</Link>
											</div>
										</Typography>
									}
								/>

								{/* <div className="mb-3 flex flex-col  justify-between border-b pb-2">
                    <p className=" truncate text-2xl font-bold text-gray-800 ">
                      {group.name}
                    </p>
                    <p className="mt-2 truncate text-sm text-gray-500">
                      {group.description}
                    </p>
                  </div> */}

								{/* <div className="flex justify-end bg-gray-100 p-2">
                  <Link to={`/group/detail/${group._id}`}>
                    <Button
                      type="link"
                      rightIcon={<ExternalLinkIcon className="w-5" />}
                    >
                      Open
                    </Button>
                  </Link>
                </div> */}
							</div>
						))}
						{groupList.length < 3 && (
							<>
								<Link
									to="/addgroup"
									className="h-56 rounded-xl shadow-sm sm:w-3/4">
									<div className="flex h-56 min-w-full cursor-pointer flex-col items-center  justify-center rounded-xl border-2 border-dashed bg-pink-50 hover:bg-pink-100 sm:min-w-0">
										<p>
											<PlusCircleIcon className="mb-4 w-10 stroke-1 text-gray-600" />{" "}
										</p>
										<p className="text-2xl font-medium text-gray-600">
											Add Group
										</p>
									</div>
								</Link>
							</>
						)}
					</div>
				) : (
					<Loading />
				)}
			</div>
			{/* Expense Overview */}
			<div className="mt-12 mb-10 shadow-md rounded-xl bg-white ">
				<CardHeader
					variant="gradient"
					color="blue"
					className="flex justify-center border-b p-3">
					<h1 className="text-2xl font-bold p-2">Expense Overview</h1>
				</CardHeader>

				<div className="grid-col-1 mt-6 grid space-y-3 sm:place-content-center sm:place-items-center sm:space-y-0 md:grid-cols-2">
					<div className="min-w-full  md:pl-8">
						<PieChart />
					</div>
					<div className="min-w-full  md:pl-8">
						<BarChart />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
