import hashlib
import time
import uuid
from datetime import datetime
from django.db import models


class Transaction(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),  # Chưa khai thác
        ("mined", "Mined"),      # Đã khai thác
    )

    transaction_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    student_id = models.CharField(max_length=50)
    course = models.CharField(max_length=100)
    score = models.FloatField()
    timestamp = models.FloatField(default=time.time)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    hash = models.CharField(max_length=64, blank=True, null=True)

    def toDict(self):
        return {
            "transaction_id": str(self.transaction_id),
            "student_id": self.student_id,
            "course": self.course,
            "score": self.score,
            "timestamp": self.timestamp,
            "status": self.status,
            "hash": self.hash,
        }

    def __str__(self):
        return f"{self.student_id} - {self.course} - {self.score}"
    
    def calculateHash(self):
        # Tính toán lại hash của giao dịch
        transaction_string = f"{self.student_id}{self.course}{self.score}{self.timestamp}{self.status}"
        return hashlib.sha256(transaction_string.encode()).hexdigest()


class Block(models.Model):
    index = models.IntegerField()
    previous_hash = models.CharField(max_length=64)
    timestamp = models.FloatField(default=time.time)
    nonce = models.IntegerField(default=0)
    hash = models.CharField(max_length=64)
    merkle_root = models.CharField(max_length=64, default="0")  # Thêm thuộc tính Merkle Root
    transactions = models.ManyToManyField(Transaction)

    def calculateHash(self):
        # Tính toán lại hash của block
        block_data = (
            f"{self.index}"
            f"{self.previous_hash}"
            f"{self.timestamp}"
            f"{self.nonce}"
            f"{self.merkle_root}"
        )
        return hashlib.sha256(block_data.encode()).hexdigest()

    def calculateMerkleRoot(self):
        # Tính Merkle Root từ danh sách giao dịch
        hashes = []
        for tx in self.transactions.all():
            # Chuyển giao dịch thành dictionary
            transaction_dict = tx.toDict()
            # Chuyển dictionary thành chuỗi
            transaction_string = str(transaction_dict)
            # Mã hóa chuỗi thành bytes
            transaction_bytes = transaction_string.encode()
            # Tính hash
            transaction_hash = hashlib.sha256(transaction_bytes).hexdigest()
            # Thêm hash vào danh sách
            hashes.append(transaction_hash)

        while len(hashes) > 1:
            # Nếu số lượng lẻ, sao chép hash cuối
            if len(hashes) % 2 == 1:
                hashes.append(hashes[-1])
            # Ghép đôi và tạo mã băm mới
            new_level = []
            for i in range(0, len(hashes), 2):
                combined = hashes[i] + hashes[i + 1]
                new_hash = hashlib.sha256(combined.encode()).hexdigest()
                new_level.append(new_hash)
            hashes = new_level
        # Nếu không có giao dịch, trả về "0"
        return hashes[0] if hashes else "0"


class Blockchain:
    def __init__(self):
        self.difficulty = 3  # Độ khó để khai thác khối mới

    def create_genesis_block(self):
        # Tạo giao dịch mẫu
        transaction = Transaction.objects.create(
            student_id="000",
            course="Genesis",
            score=100.0,
        )

        # Tạo Genesis Block
        genesis_block = Block(index=0, previous_hash="0")
        genesis_block.save()

        # Gắn giao dịch
        genesis_block.transactions.add(transaction)
        genesis_block.hash = genesis_block.calculateHash()
        genesis_block.save()
        print(f"Genesis Block Created: Index {genesis_block.index}, Transactions: {list(genesis_block.transactions.all())}")

        return genesis_block

    def get_latest_block(self):
        # Lấy khối cuối cùng trong blockchain
        return Block.objects.last()

    def add_transaction(self, student_id, course, score):
        # Tạo giao dịch mới
        transaction = Transaction(student_id=student_id, course=course, score=score)
        transaction.save()
        return transaction

    def mine_pending_transactions(self):
        # Lấy các giao dịch chờ xử lý
        pending_transactions = Transaction.objects.all()
        print(f"Pending Transactions: {list(pending_transactions)}")  # Log giao dịch chờ xử lý

        if not pending_transactions:
            return None

        latest_block = self.get_latest_block()
        index = latest_block.index + 1 if latest_block else 0
        previous_hash = latest_block.hash if latest_block else "0"

        # Tạo khối mới
        new_block = Block(index=index, previous_hash=previous_hash)
        new_block.save()
        print(f"New Block Created: Index {new_block.index}, Previous Hash {new_block.previous_hash}")

        # Gắn giao dịch vào khối mới
        new_block.transactions.set(pending_transactions)
        print(f"Transactions Linked to Block {new_block.index}: {list(new_block.transactions.all())}")

        # Tính Merkle Root và Hash
        new_block.merkle_root = new_block.calculateMerkleRoot()
        new_block.hash = new_block.calculateHash()
        new_block.save()

        # Xóa giao dịch sau khi liên kết
        pending_transactions.delete()
        print(f"Pending Transactions After Mining: {list(Transaction.objects.all())}")

        return new_block


    def is_chain_valid(self):
        blocks = Block.objects.all().order_by('index')
        invalid_blocks = []  # Danh sách các block bị thay đổi

        for i in range(1, len(blocks)):
            current_block = blocks[i]
            previous_block = blocks[i - 1]

            # Kiểm tra hash của khối hiện tại
            if current_block.hash != current_block.calculateHash():
                print(f"Block {current_block.index} đã bị sửa đổi! Hash không khớp.")
                invalid_blocks.append(current_block)

            # Kiểm tra liên kết với khối trước
            if current_block.previous_hash != previous_block.hash:
                print(f"Block {current_block.index} không khớp với hash của khối trước!")
                invalid_blocks.append(current_block)

            # Kiểm tra Merkle Root
            calculated_merkle_root = current_block.calculateMerkleRoot()
            if current_block.merkle_root != calculated_merkle_root:
                print(f"Block {current_block.index} có Merkle Root không khớp!")
                invalid_blocks.append(current_block)

        if invalid_blocks:
            return False, invalid_blocks
        return True, []
