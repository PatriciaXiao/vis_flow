# import MySQLdb
import datetime
from flask import Flask, request, session, g, redirect, url_for, abort, \
	 render_template, flash

app = Flask(__name__) # create the application instance
app.config.from_object(__name__) # load config from this file, vis_flow.py


@app.route('/test/')
def test():
	# return redirect(url_for('flow'))
	return render_template('test.html')


@app.route('/')
def flow():
	return render_template('income_flow.html')

if __name__ == '__main__':
	app.run()