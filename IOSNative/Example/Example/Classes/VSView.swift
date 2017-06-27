/*!
 //  VSView.swift
 //  VSView
 //
 //  Created by Viral on 07/10/15.
 //  Copyright © 2015 Viral. All rights reserved.
 */

import UIKit
@IBDesignable
/*!
 UIView Designable class
 */
class VSView : UIView {
    var shadowAdded: Bool = false
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    /*!
     Variable Define
     */
    var bottomBorder: UIView?
    /*!
     View border color Object
     */
    @IBInspectable var borderColor: UIColor = UIColor.clear {
        didSet {
            layer.borderColor = borderColor.cgColor
            layer.masksToBounds = true
        }
    }
    /*!
     View border width Object
     */
    @IBInspectable var borderWidth: CGFloat = 0 {
        didSet {
            layer.borderWidth = borderWidth
            layer.masksToBounds = true
        }
    }
    
    /*!
     *   @brief View corner radius Object
     */
    @IBInspectable var cornerRadius: CGFloat = 0 {
        didSet {
            layer.cornerRadius = cornerRadius
            layer.masksToBounds = true
        }
    }
    /*!
     View corner radius Object
     */
    @IBInspectable var bottomBorderColor : UIColor = UIColor.clear {
        didSet {
            bottomBorder?.backgroundColor = bottomBorderColor
        }
    }
    /*!
     View bottom border height Object
     */
    @IBInspectable var bottomBorderHeight : CGFloat = 0 {
        didSet{
            if bottomBorderHeight > 0 {
                if bottomBorder == nil{
                    bottomBorder = UIView()
                    addSubview(bottomBorder!)
                }
                bottomBorder?.backgroundColor = bottomBorderColor
                bottomBorder?.frame = CGRect(x: 0,y: self.frame.size.height - bottomBorderHeight,width: self.frame.size.width,height: bottomBorderHeight)
            }
            else {
                bottomBorder?.removeFromSuperview()
                bottomBorder = nil
            }
            
        }
    }
    @IBInspectable var isShawdow: Bool = false
    /*!
     View's super method layoutSubviews()
     */
    override func layoutSubviews() {
        super.layoutSubviews()
        if bottomBorder != nil{
            bottomBorder?.frame = CGRect(x: 0,y: self.frame.height - bottomBorderHeight,width: self.frame.size.width,height: bottomBorderHeight)
        }
        if isShawdow {
            if shadowAdded { return }
            shadowAdded = true
            
            let shadowLayer = UIView(frame: self.frame)
            shadowLayer.backgroundColor = UIColor.clear
            shadowLayer.layer.shadowColor = UIColor.gray.cgColor
            shadowLayer.layer.shadowPath = UIBezierPath(roundedRect: bounds, cornerRadius: self.cornerRadius).cgPath
            shadowLayer.layer.shadowOffset = CGSize(width: -1, height: 1)
            shadowLayer.layer.shadowOpacity = 0.3
            shadowLayer.layer.shadowRadius = 5
            shadowLayer.layer.masksToBounds = true
            shadowLayer.clipsToBounds = false
            
            self.superview?.addSubview(shadowLayer)
            self.superview?.bringSubview(toFront: self)
        }
    }
}
