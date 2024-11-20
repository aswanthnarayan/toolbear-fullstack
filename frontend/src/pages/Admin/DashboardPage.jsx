import React from 'react';
import { StaticsCard } from '../../components/Admin/Material/StaticsCard';

const Dashboard = () => {
  const statsData = [
    { title: 'POSTS', value: 2500, percentage: '42%' },
    { title: 'COMMENTS', value: 1500, percentage: '30%' },
    { title: 'LIKES', value: 5000, percentage: '70%' },
    { title: 'SHARES', value: 1200, percentage: '50%' },
  ];

  return (
    <div className=''>
      <div>
        <p className="text-xl font-bold">Dashboard</p>
        <p className="text-lg">Blog Overview</p>
      </div>
      <div className='flex justify-evenly'>
        {statsData.map((stat, index) => (
          <StaticsCard
            key={index}
            title={stat.title}
            value={stat.value}
            percentage={stat.percentage}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;