-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2024 at 02:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bee-smart`
--

-- --------------------------------------------------------

--
-- Table structure for table `hive_details`
--

CREATE TABLE `hive_details` (
  `hive_no` int(11) NOT NULL,
  `temperature` int(11) DEFAULT NULL,
  `humidity` int(11) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `health_status` varchar(10) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `bees_in` int(11) DEFAULT NULL,
  `bees_out` int(11) DEFAULT NULL,
  `active_status` varchar(10) DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hive_details`
--

INSERT INTO `hive_details` (`hive_no`, `temperature`, `humidity`, `weight`, `health_status`, `location`, `bees_in`, `bees_out`, `active_status`, `last_updated`) VALUES
(1, 35, 45, 14, 'Healthy', 'Akkaraipattu', 120, 110, 'Active', '2024-11-23 21:41:05'),
(2, 36, 45, 13, 'Healthy', 'Kalmunai', 130, 115, 'Active', '2024-11-17 12:52:45'),
(3, 34, 48, 12, 'Unhealthy', 'Batticaloa', 100, 90, 'Deactive', '2024-10-03 21:16:32'),
(4, 37, 49, 14, 'Healthy', 'Thirukovil', 140, 120, 'Active', '2024-10-07 13:15:06'),
(5, 36, 46, 13, 'Healthy', 'Akkaraipattu', 125, 100, 'Active', '2024-10-03 21:16:32'),
(6, 33, 47, 12, 'Unhealthy', 'Kalmunai', 90, 85, 'Deactive', '2024-10-03 21:16:32'),
(7, 38, 49, 15, 'Healthy', 'Batticaloa', 150, 130, 'Active', '2024-10-03 21:16:32'),
(8, 37, 46, 14, 'Unhealthy', 'Thirukovil', 115, 100, 'Deactive', '2024-10-03 21:16:32'),
(9, 36, 45, 13, 'Healthy', 'Akkaraipattu', 125, 110, 'Active', '2024-10-03 21:16:32'),
(10, 35, 44, 13, 'Healthy', 'Kalmunai', 135, 120, 'Active', '2024-10-03 21:16:32'),
(11, 34, 48, 12, 'Unhealthy', 'Batticaloa', 110, 95, 'Active', '2024-10-03 21:16:32'),
(12, 38, 50, 15, 'Healthy', 'Thirukovil', 140, 125, 'Active', '2024-10-03 21:16:32'),
(13, 39, 47, 14, 'Healthy', 'Akkaraipattu', 145, 130, 'Active', '2024-10-03 21:16:32'),
(14, 38, 48, 17, 'Healthy', 'Akkaraipattu', 136, 120, 'Active', '2024-10-03 23:36:11');

-- --------------------------------------------------------

--
-- Table structure for table `hive_reports`
--

CREATE TABLE `hive_reports` (
  `id` int(11) NOT NULL,
  `hive_task_id` int(11) NOT NULL,
  `hive_no` int(11) NOT NULL,
  `task_type` enum('daily','weekly','monthly') NOT NULL,
  `report_content` text NOT NULL,
  `report_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hive_reports`
--

INSERT INTO `hive_reports` (`id`, `hive_task_id`, `hive_no`, `task_type`, `report_content`, `report_date`, `created_at`) VALUES
(4, 16, 3, 'monthly', 'month', '2024-11-02', '2024-11-02 21:43:07'),
(5, 1, 1, 'daily', 'dailu', '2024-11-02', '2024-11-02 21:44:51'),
(6, 7, 2, 'weekly', 'ds', '2024-11-02', '2024-11-02 21:45:38'),
(7, 19, 6, 'weekly', 'check', '2024-11-03', '2024-11-03 19:42:34');

-- --------------------------------------------------------

--
-- Table structure for table `hive_tasks`
--

CREATE TABLE `hive_tasks` (
  `id` int(11) NOT NULL,
  `hive_no` int(11) NOT NULL,
  `task_type` enum('daily','weekly','monthly') NOT NULL,
  `task_date` date DEFAULT NULL,
  `task_week` varchar(7) DEFAULT NULL,
  `task_month` varchar(7) DEFAULT NULL,
  `task_list` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hive_tasks`
--

INSERT INTO `hive_tasks` (`id`, `hive_no`, `task_type`, `task_date`, `task_week`, `task_month`, `task_list`, `created_at`) VALUES
(1, 1, 'daily', '2024-10-01', NULL, NULL, 'Monitor bee activity,Check Hive entrances,Monitor disturbances', '2024-10-27 20:37:41'),
(2, 1, 'daily', '2024-10-01', NULL, NULL, 'Monitor bee activity,Check Hive entrances', '2024-10-27 20:55:09'),
(3, 1, 'daily', '2024-10-01', NULL, NULL, 'Monitor bee activity,Check Hive entrances', '2024-10-27 20:56:26'),
(4, 1, 'daily', '2024-10-02', NULL, NULL, 'Check Hive entrances,Monitor disturbances', '2024-10-27 20:59:07'),
(5, 1, 'daily', '2024-10-02', NULL, NULL, 'Check Hive entrances,Monitor disturbances', '2024-10-27 21:12:07'),
(6, 1, 'daily', '2024-11-01', NULL, NULL, 'Check Hive entrances,Monitor disturbances', '2024-11-01 20:01:09'),
(7, 2, 'weekly', NULL, '2024-W4', NULL, 'Clean hive areas,Check for pests and diseases', '2024-11-01 20:47:31'),
(8, 1, 'daily', '2024-11-02', NULL, NULL, 'Monitor bee activity,Check Hive entrances', '2024-11-01 20:49:23'),
(9, 1, 'daily', '2024-11-02', NULL, NULL, 'Check Hive entrances', '2024-11-01 21:10:59'),
(10, 1, 'weekly', NULL, '2024-W4', NULL, 'Clean hive areas,Check for pests and diseases', '2024-11-01 21:21:28'),
(11, 2, 'monthly', NULL, NULL, '2024-02', 'Inspect hive frames and clean equipment', '2024-11-01 21:22:27'),
(12, 2, 'daily', '2024-11-01', NULL, NULL, 'Check Hive entrances,Monitor disturbances', '2024-11-02 20:44:51'),
(13, 4, 'daily', '2024-11-03', NULL, NULL, 'Check Hive entrances,Monitor disturbances', '2024-11-02 21:19:12'),
(14, 3, 'weekly', NULL, '2024-W4', NULL, 'Clean hive areas,Check for pests and diseases', '2024-11-02 21:27:29'),
(15, 5, 'daily', '2024-11-03', NULL, NULL, 'Check Hive entrances,Monitor disturbances', '2024-11-02 21:38:27'),
(16, 3, 'monthly', NULL, NULL, '2024-01', 'Check hive condition', '2024-11-02 21:43:01'),
(17, 1, 'daily', '2024-11-03', NULL, NULL, 'Check Hive entrances,Monitor disturbances,Monitor weather conditions', '2024-11-02 21:44:44'),
(18, 2, 'weekly', NULL, '2024-W4', NULL, 'Check for pests and diseases,Look for signs of overcrowding', '2024-11-02 21:45:33'),
(19, 6, 'weekly', NULL, '2024-W4', NULL, 'Check for pests and diseases,Look for signs of overcrowding,Provide supplemental feeding,Check hive ventilation', '2024-11-03 19:42:21'),
(20, 1, 'daily', '2025-06-15', NULL, NULL, 'Monitor bee activity,Check Hive entrances,Monitor disturbances', '2024-11-04 12:54:07'),
(21, 1, 'daily', '2024-11-01', NULL, NULL, 'Check Hive entrances,Monitor disturbances', '2024-11-04 19:56:29'),
(22, 2, 'weekly', NULL, '2024-W4', NULL, 'Inspect hive interior,Clean hive areas', '2024-12-06 20:11:13');

-- --------------------------------------------------------

--
-- Table structure for table `hive_update_history`
--

CREATE TABLE `hive_update_history` (
  `id` int(11) NOT NULL,
  `hive_no` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `temperature` int(11) DEFAULT NULL,
  `humidity` int(11) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `health_status` varchar(20) DEFAULT NULL,
  `active_status` varchar(20) DEFAULT NULL,
  `bees_in` int(11) DEFAULT NULL,
  `bees_out` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hive_update_history`
--

INSERT INTO `hive_update_history` (`id`, `hive_no`, `updated_at`, `temperature`, `humidity`, `weight`, `health_status`, `active_status`, `bees_in`, `bees_out`) VALUES
(1, 1, '2024-10-03 20:17:12', 35, 46, 13, 'Healthy', 'Active', 120, 110),
(2, 1, '2024-10-03 20:17:26', 36, 45, 13, 'Healthy', 'Active', 120, 110),
(3, 2, '2024-10-03 20:18:32', 35, 45, 13, 'Healthy', 'Deactive', 130, 115),
(4, 4, '2024-10-03 20:32:11', 38, 50, 13, 'Healthy', 'Active', 140, 120),
(5, 1, '2024-10-07 11:27:22', 36, 45, 13, 'Healthy', 'Active', 120, 110),
(6, 4, '2024-10-07 12:15:06', 36, 49, 14, 'Healthy', 'Active', 140, 120),
(7, 1, '2024-10-07 22:29:40', 35, 45, 13, 'Healthy', 'Active', 120, 110),
(8, NULL, NULL, 0, 0, 0, 'healthy', 'active', 0, 0),
(9, 2, '2024-10-16 10:36:43', 35, 45, 13, 'Healthy', 'Deactive', 130, 115),
(10, 2, '2024-11-17 10:52:44', 35, 45, 13, 'Healthy', 'Active', 130, 115),
(11, 1, '2024-11-23 19:00:12', 35, 45, 13, 'Healthy', 'Active', 120, 110),
(12, 2, '2024-11-23 19:00:42', 36, 45, 13, 'Healthy', 'Active', 130, 115),
(13, 1, '2024-11-23 19:30:12', 34, 45, 13, 'Healthy', 'Active', 120, 110),
(14, 1, '2024-11-23 19:41:05', 35, 45, 13, 'Healthy', 'Active', 120, 110);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`) VALUES
(1, 'diluprapa11@gmail.com', 'Dilu'),
(2, 'diluprapa11@gmail.com', 'Dilu');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hive_details`
--
ALTER TABLE `hive_details`
  ADD PRIMARY KEY (`hive_no`);

--
-- Indexes for table `hive_reports`
--
ALTER TABLE `hive_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hive_task_id` (`hive_task_id`);

--
-- Indexes for table `hive_tasks`
--
ALTER TABLE `hive_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hive_no` (`hive_no`);

--
-- Indexes for table `hive_update_history`
--
ALTER TABLE `hive_update_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hive_reports`
--
ALTER TABLE `hive_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `hive_tasks`
--
ALTER TABLE `hive_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `hive_update_history`
--
ALTER TABLE `hive_update_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hive_reports`
--
ALTER TABLE `hive_reports`
  ADD CONSTRAINT `hive_reports_ibfk_1` FOREIGN KEY (`hive_task_id`) REFERENCES `hive_tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hive_tasks`
--
ALTER TABLE `hive_tasks`
  ADD CONSTRAINT `hive_tasks_ibfk_1` FOREIGN KEY (`hive_no`) REFERENCES `hive_details` (`hive_no`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
