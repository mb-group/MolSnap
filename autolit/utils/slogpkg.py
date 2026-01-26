"""
A Python logging class inspired by Go's slog package
"""
import logging
import sys
from datetime import datetime
from enum import IntEnum
import os
from typing import Union


class Level(IntEnum):
    DEBUG = 10
    INFO = 20
    WARN = 30
    ERROR = 40


class PrettyLogger:
    def __init__(
        self,
        name: str = "slog",
        level: Level = Level.INFO,
        log_file: Union[str, None] = None,
    ):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level.value)

        # Prevent duplicate handlers
        if not self.logger.handlers:
            # Console handler
            console_handler = logging.StreamHandler(sys.stdout)
            formatter = PrettyFormatter()
            console_handler.setFormatter(formatter)
            self.logger.addHandler(console_handler)

            # File handler (optional)
            if log_file:
                os.makedirs(os.path.dirname(log_file), exist_ok=True)
                file_handler = logging.FileHandler(log_file)
                file_handler.setFormatter(formatter)
                self.logger.addHandler(file_handler)

    def debug(self, msg: str, **kwargs):
        self.logger.debug(msg, extra={"slog_args": (), "slog_kwargs": kwargs})

    def info(self, msg: str, **kwargs):
        self.logger.info(msg, extra={"slog_args": (), "slog_kwargs": kwargs})

    def warn(self, msg: str, **kwargs):
        self.logger.warning(msg, extra={"slog_args": (), "slog_kwargs": kwargs})

    def error(self, msg: str, **kwargs):
        self.logger.error(msg, extra={"slog_args": (), "slog_kwargs": kwargs})

    def with_(self, **kwargs) -> "PrettyLogger":
        """Create a new logger with additional context"""
        new_logger = PrettyLogger(self.logger.name, Level(self.logger.level))
        # Store context in logger
        new_logger._context = kwargs  # type: ignore
        return new_logger


class PrettyFormatter(logging.Formatter):
    def format(self, record):
        # Get timestamp
        timestamp = datetime.fromtimestamp(record.created).strftime(
            "%Y-%m-%d %H:%M:%S.%f"
        )[:-3]

        # Level colors
        level_colors = {
            "DEBUG": "\033[36m",  # Cyan
            "INFO": "\033[32m",  # Green
            "WARNING": "\033[33m",  # Yellow
            "ERROR": "\033[31m",  # Red
            "CRITICAL": "\033[35m",  # Magenta
        }

        reset_color = "\033[0m"
        level_color = level_colors.get(record.levelname, "")

        # Format message
        msg = record.getMessage()

        # Handle structured data from slog
        context_str = ""
        if hasattr(record, "slog_kwargs") and record.slog_kwargs:  # type: ignore
            context_items = []
            for key, value in record.slog_kwargs.items():  # type: ignore
                if isinstance(value, (str, int, float, bool)):
                    context_items.append(f"{key}={value}")
                else:
                    context_items.append(f"{key}={repr(value)}")
            if context_items:
                context_str = " " + " ".join(context_items)

        # Combine everything
        formatted_message = f"{level_color}[{timestamp}] {record.levelname:8} {reset_color}{msg}{context_str}"

        # Add exception info
        if record.exc_info:
            formatted_message += f"\n{self.formatException(record.exc_info)}"

        return formatted_message


# Alternative: Create a more Go-slog-like interface
class GoStyleLogger:
    def __init__(self, log_file: Union[str, None] = None):
        self.logger = PrettyLogger(log_file=log_file)

    def Debug(self, msg: str, **kwargs):
        self.logger.debug(msg, **kwargs)

    def Info(self, msg: str, **kwargs):
        self.logger.info(msg, **kwargs)

    def Warn(self, msg: str, **kwargs):
        self.logger.warn(msg, **kwargs)

    def Error(self, msg: str, **kwargs):
        self.logger.error(msg, **kwargs)

    def With(self, **kwargs) -> "GoStyleLogger":
        """Create a new logger with additional context"""
        new_logger = GoStyleLogger()
        # This is a simplified version - in practice you'd want to pass context properly
        return new_logger


# Example usage:
if __name__ == "__main__":
    slog = GoStyleLogger("./app.log")
    slog.Info("Application started", version="v1.0.0")
    slog.Error("Something went wrong", error_code=500)
