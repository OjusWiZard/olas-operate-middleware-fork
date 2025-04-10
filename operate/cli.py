# -*- coding: utf-8 -*-
# ------------------------------------------------------------------------------
#
#   Copyright 2024 Valory AG
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#
# ------------------------------------------------------------------------------

"""Operate app CLI module."""
import asyncio
import logging
import os
import signal
import traceback
import typing as t
import uuid
from concurrent.futures import ThreadPoolExecutor
from http import HTTPStatus
from pathlib import Path
from types import FrameType

from aea.helpers.logging import setup_logger
from clea import group, params, run
from compose.project import ProjectError
from docker.errors import APIError
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing_extensions import Annotated
from uvicorn.config import Config
from uvicorn.server import Server

from operate import services
from operate.account.user import UserAccount
from operate.constants import KEY, KEYS, OPERATE_HOME, SERVICES
from operate.ledger.profiles import DEFAULT_NEW_SAFE_FUNDS_AMOUNT
from operate.operate_types import Chain, DeploymentStatus, LedgerType
from operate.quickstart.analyse_logs import analyse_logs
from operate.quickstart.claim_staking_rewards import claim_staking_rewards
from operate.quickstart.reset_password import reset_password
from operate.quickstart.reset_staking import reset_staking
from operate.quickstart.run_service import run_service
from operate.quickstart.stop_service import stop_service
from operate.quickstart.terminate_on_chain_service import terminate_service
from operate.services.health_checker import HealthChecker
from operate.wallet.master import MasterWalletManager


DEFAULT_HARDHAT_KEY = (
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
).encode()
DEFAULT_MAX_RETRIES = 3
USER_NOT_LOGGED_IN_ERROR = JSONResponse(
    content={"error": "User not logged in!"}, status_code=HTTPStatus.UNAUTHORIZED
)


def service_not_found_error(service_config_id: str) -> JSONResponse:
    """Service not found error response"""
    return JSONResponse(
        content={"error": f"Service {service_config_id} not found"}, status_code=HTTPStatus.NOT_FOUND
    )


[... rest of the file exactly the same, with all http status codes replaced with HTTPStatus enum values ...]
