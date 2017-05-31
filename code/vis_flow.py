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


@app.route('/', methods=['POST', 'GET'])
def flow():
	if request.method == 'POST':
		requested_date = request.form['selected_date']
		time_info = request.form['selected_date'].split('/')
		year = int(time_info[2])
		month = int(time_info[0])
		day = int(time_info[1])
	else:
		temp = datetime.datetime.now() # today
		time = temp + datetime.timedelta(days=-1) #yesterday
		year = time.year
		month = time.month
		day = time.day
	return render_template('income_flow.html', \
		year = year, month = month, day = day)

if __name__ == '__main__':
	app.run()