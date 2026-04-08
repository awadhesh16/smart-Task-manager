from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Create DB
def init_db():
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            priority TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def home():
    return render_template('project.html')

@app.route('/add', methods=['POST'])
def add_task():
    data = request.get_json()
    name = data['name']
    priority = data['priority']

    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute("INSERT INTO tasks (name, priority) VALUES (?, ?)", (name, priority))
    conn.commit()
    conn.close()

    return jsonify({"message": "Task added"})

@app.route('/get')
def get_tasks():
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute("SELECT * FROM tasks")
    rows = c.fetchall()
    conn.close()

    tasks = [{"id": r[0], "name": r[1], "priority": r[2]} for r in rows]
    return jsonify(tasks)

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_task(id):
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute("DELETE FROM tasks WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted"})

if __name__ == '__main__':
    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=5000)